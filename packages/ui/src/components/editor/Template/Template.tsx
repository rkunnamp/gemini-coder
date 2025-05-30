import styles from './Template.module.scss'

namespace Template {
  export type Props = {
    edit_view_slot?: React.ReactNode
    tabs_slot: React.ReactNode
  }
}

export const Template: React.FC<Template.Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.edit_view_slot && (
        <div className={styles.slot}>{props.edit_view_slot}</div>
      )}
      <div className={styles.slot}>{props.tabs_slot}</div>
    </div>
  )
}
