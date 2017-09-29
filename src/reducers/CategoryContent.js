const categoryContent = (state = [], action) => {
  switch (action.type) {
    case 'INIT_CONTENT_LIST':
      return [
        {
          monthList: action.monthList
        }
      ]
    case 'TOGGLE_DELETE_MODE':
      return [
        {
          activeStatus: action.status,
          deleteMode: action.state,
        }
      ]
    case 'TOGGLE_SELECTED_ITEM':
      return [
        {
          itemSelected: action.isSelected
        }
      ]
    case 'MASK_AREA':
      return [
        {
          isProcessing: action.isMasked,
          opacity: action.isMasked?0.4:1
        }
      ]
    case 'SET_EDITOR_MODE':
      return [
        ...state,
        {
          mode: action.mode
        }
      ]
    default:
      return state
  }
}

export default categoryContent