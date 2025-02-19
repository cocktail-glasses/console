import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { TypographyVariant } from '@mui/material/styles';

export type HeaderStyle = 'main' | 'subsection' | 'normal' | 'label';

export interface SectionHeaderProps {
  title: string;
  actions?: React.ReactNode[] | null;
  noPadding?: boolean;
  headerStyle?: HeaderStyle;
  titleSideActions?: React.ReactNode[];
}

export default function SectionHeader(props: SectionHeaderProps) {
  const { noPadding = false, headerStyle = 'main', titleSideActions = [] } = props;
  const actions = props.actions || [];
  const titleVariants: { [key: string]: TypographyVariant } = {
    main: 'h1',
    subsection: 'h2',
    normal: 'h3',
    label: 'h4',
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={(theme: Theme) => ({
        padding: theme.spacing(noPadding ? 0 : 2),
        paddingTop: theme.spacing(noPadding ? 0 : 3),
        paddingRight: '0',
      })}
      spacing={2}
    >
      <Grid item>
        {(!!props.title || titleSideActions.length > 0) && (
          <Box display="flex" alignItems="center">
            {!!props.title && (
              <Typography
                variant={titleVariants[headerStyle]}
                noWrap
                sx={(theme: Theme) => ({
                  ...theme.palette.headerStyle[headerStyle || 'normal'],
                  whiteSpace: 'pre-wrap',
                })}
              >
                {props.title}
              </Typography>
            )}
            {!!titleSideActions && (
              <Box ml={1} justifyContent="center">
                {titleSideActions}
              </Box>
            )}
          </Box>
        )}
      </Grid>
      {actions.length > 0 && (
        <Grid item>
          <Grid item container alignItems="center" justifyContent="flex-end">
            {actions.map((action, i) => (
              <Grid item key={`SectionHeader_actions_${i}`}>
                {action}
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
