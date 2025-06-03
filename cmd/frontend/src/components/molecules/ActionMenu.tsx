import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { MouseEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from '@iconify/react';

type ActionMenuProps = {
  menus: MenuProps[];
}

type MenuProps = {
  name: string;
  disabled?: boolean;
  onClick: MouseEventHandler;
}

function ActionMenu(props: ActionMenuProps) {
  const { menus } = props;
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event: any) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton size="medium" onClick={handleClick} >
        <Icon icon="mdi:dots-vertical" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {menus.map((menu, idx) =>
          <MenuItem onClick={menu.onClick} disabled={menu.disabled} key={`action_menu_${idx}`}>
            <Typography color={'primary'}>{t(menu.name)}</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default ActionMenu