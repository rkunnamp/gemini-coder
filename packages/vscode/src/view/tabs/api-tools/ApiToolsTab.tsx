import { Button } from '@ui/components/editor/Button'
import styles from './ApiToolsTab.module.scss'
import { useEffect, useState } from 'react'
import { ExtensionMessage } from '@/view/types/messages'

type Props = {
  vscode: any
  is_visible: boolean
  on_configure_api_tools_click: () => void
}

export const ApiToolsTab: React.FC<Props> = (props) => {
  const [has_active_editor, set_has_active_editor] = useState(false)

  useEffect(() => {
    const handle_message = (event: MessageEvent<ExtensionMessage>) => {
      const message = event.data
      if (message.command == 'EDITOR_STATE_CHANGED') {
        set_has_active_editor(message.has_active_editor)
      }
    }
    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }, [])

  const handle_execute_command = (command_id: string) => {
    props.vscode.postMessage({ command: 'EXECUTE_COMMAND', command_id })
  }

  const handle_code_completions_more_actions = () => {
    const items = [
      {
        label: 'Enter suggestions',
        command: 'geminiCoder.codeCompletionWithSuggestionsAutoAccept'
      },
      {
        label: 'Copy prompt to clipboard',
        command: 'geminiCoder.codeCompletionToClipboard'
      },
      {
        label: 'Enter suggestions & copy',
        command: 'geminiCoder.codeCompletionWithSuggestionsToClipboard'
      }
    ]

    props.vscode.postMessage({
      command: 'SHOW_QUICK_PICK',
      items,
      title: 'More actions...'
    })
  }

  const handle_file_refactoring_more_actions = () => {
    const items = [
      {
        label: 'Copy prompt to clipboard',
        command: 'geminiCoder.refactorToClipboard'
      }
    ]

    props.vscode.postMessage({
      command: 'SHOW_QUICK_PICK',
      items,
      title: 'More actions...'
    })
  }

  const code_completion_title = has_active_editor
    ? 'Insert code completion at the caret position'
    : 'Requires an active editor'

  const refactor_title = has_active_editor
    ? 'Refactor the content of the active file'
    : 'Requires an active editor'

  const apply_chat_response_title = 'Apply chat response from clipboard'

  const configuration_title = 'Configure API tool settings'

  return (
    <div
      className={styles.container}
      style={{ display: !props.is_visible ? 'none' : undefined }}
    >
      <div className={styles.button_group}>
        <Button
          on_click={() => {
            handle_execute_command('geminiCoder.codeCompletionAutoAccept')
          }}
          on_quick_pick_trigger_click={handle_code_completions_more_actions}
          disabled={!has_active_editor}
          title={code_completion_title}
        >
          Insert Code Completion
        </Button>
        <Button
          on_click={() => handle_execute_command('geminiCoder.refactor')}
          on_quick_pick_trigger_click={handle_file_refactoring_more_actions}
          disabled={!has_active_editor}
          title={refactor_title}
        >
          Refactor Active File
        </Button>
        <Button
          on_click={() =>
            handle_execute_command('geminiCoder.applyChatResponse')
          }
          title={apply_chat_response_title}
        >
          Apply Chat Response
        </Button>
      </div>

      <hr />

      <Button
        on_click={props.on_configure_api_tools_click}
        codicon="settings-gear"
        title={configuration_title}
      >
        Configure API Tools
      </Button>
    </div>
  )
}
