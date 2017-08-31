export const showDetailSidebar = (sidebarType, sidebarProps) => {
  return {
    type: 'SHOW_DETAIL_SIDEBAR',
    sidebarType,
    sidebarProps
  }
}

export const hideDetailSidebar = () => {
  return {
    type: 'HIDE_DETAIL_SIDEBAR'
  }
}

