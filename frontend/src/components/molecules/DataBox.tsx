import { Fragment } from 'react/jsx-runtime';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { get } from 'lodash';

type DataBoxProps = {
  items: FieldProps[];
  value: any;
};

type FieldProps = {
  type: string;
  name: string;
  label: string;
  [prop: string]: any;
};

function DataBox(props: DataBoxProps) {
  const { items, value } = props;

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      subheader={
        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
          기본정보
        </Typography>
      }
    >
      {items.map((item, index) => {
        const v = get(value, item.name);
        return (
          <Fragment key={`data_box_item_${index}`}>
            <ListItem>
              <ListSubheader sx={{ width: '20%', lineHeight: '32px' }}>{item.label}</ListSubheader>
              {value ? (
                <ListItemText primary={v} />
              ) : (
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
              )}
            </ListItem>
            <Divider />
          </Fragment>
        );
      })}
    </List>
  );
}

export default DataBox;
