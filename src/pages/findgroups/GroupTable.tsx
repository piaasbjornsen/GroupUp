import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
// eslint-disable-next-line node/no-extraneous-import
import {visuallyHidden} from '@mui/utils';
import {Grid, TextField} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {groups as firebaseGroups} from '../../service/firebase';
import {useEffect, useState} from 'react';
import {interests as firebaseInterests} from '../../service/firebase';
import {
  IFirebaseGroup,
  IFirebaseGroups,
  IFirebaseInterest,
} from '../../interfaces/firebase';
import {useNavigate, useParams} from 'react-router-dom';

interface Data {
  key: string;
  groupName: string;
  members: number;
  interests: string;
  description: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof Data>(
  order: Order,
  orderBy: Key
): (
  a: {[key in Key]: number | string},
  b: {[key in Key]: number | string}
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'groupName',
    numeric: false,
    disablePadding: true,
    label: 'Gruppenavn',
  },
  {
    id: 'members',
    numeric: true,
    disablePadding: false,
    label: 'Antall medlemmer',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Beskrivelse',
  },
  {
    id: 'interests',
    numeric: false,
    disablePadding: false,
    label: 'Interesser',
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {order, orderBy, onRequestSort} = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  handleFiltering: (interests: string[]) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const [interests, setInterests] = useState<IFirebaseInterest[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  const handleFilter = () => {
    props.handleFiltering(filters);
  };

  useEffect(() => {
    firebaseInterests.once('value', snapshot => {
      const interests = snapshot.val();
      setInterests(interests);
    });
  }, []);

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
      }}
    >
      <Typography
        sx={{flex: '1 1 100%'}}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Grupper
      </Typography>
      <>
        <Tooltip title="Filter">
          <Autocomplete
            size="small"
            id="addFilter"
            multiple={true}
            freeSolo
            style={{width: 500}}
            onChange={(event: React.SyntheticEvent, value: string[]) => {
              setFilters(value);
            }}
            options={interests}
            renderInput={params => (
              <TextField {...params} label="Legg til filtrering" />
            )}
          />
        </Tooltip>
        <Tooltip title="Filter list" onClick={handleFilter}>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </>
    </Toolbar>
  );
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('members');
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [groups, setGroups] = useState<Data[]>([]);
  const [rows, setRows] = useState<Data[]>([]);
  const navigate = useNavigate();
  const urlParams = useParams();

  useEffect(() => {
    firebaseGroups.once('value', snapshot => {
      const groups: IFirebaseGroups = snapshot.val();
      const groupArray = Object.entries(groups)
        .filter(
          (group: [string, IFirebaseGroup]) => group[0] !== urlParams.groupId
        )
        .map((group: [string, IFirebaseGroup]) => {
          return {
            key: group[0],
            groupName: group[1].name,
            members: group[1].members ? group[1].members.length : 0,
            interests: group[1].interests
              ? group[1].interests.sort().join(', ')
              : '',
            description: group[1].description ? group[1].description : '',
          };
        });
      setGroups(groupArray);
      setRows(groupArray);
    });
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const checkInterest = (row: Data, interests: string[]) => {
    return interests.some(interest => row.interests.includes(interest));
  };

  const handleFiltering = (interests: string[]) => {
    if (interests.length === 0) {
      setRows(groups);
      return;
    }
    setRows(groups.filter(row => checkInterest(row, interests)));
  };

  const handleClick = (event: React.MouseEvent<unknown>, groupKey: string) => {
    navigate('/groups/' + groupKey);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Grid container justifyContent="center" marginTop={10}>
      <Box sx={{width: '80%'}}>
        <Paper sx={{width: '100%', mb: 2}}>
          <EnhancedTableToolbar handleFiltering={handleFiltering} />
          <TableContainer>
            <Table
              sx={{minWidth: 750}}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => {
                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, row.key)}
                        role="checkbox"
                        tabIndex={-1}
                        key={row.key}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          align="left"
                          size="small"
                        >
                          {row.groupName}
                        </TableCell>
                        <TableCell size="small" align="right">
                          {row.members}
                        </TableCell>
                        <TableCell size="small" align="left">
                          {row.description.length > 100
                            ? row.description.substring(0, 100).trim() + '..'
                            : row.description}{' '}
                        </TableCell>
                        <TableCell size="small" align="left">
                          {row.interests}{' '}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Grid>
  );
}
