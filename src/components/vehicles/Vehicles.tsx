import { useMemo } from "react";
import Link from "next/link";
import Table from "../common/Table/Table";
import { Add, FormatListBulleted } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import {
  TextField,
  CircularProgress,
  Button,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";

import types from "../../api/types";
import drivers from "../../api/drivers";

import sx from "./styles/Vehicles.sx";
import useVehicles from "./hooks/useVehicles";
import { Vehicle } from "./types";

export const Vehicles = () => {
  const vehicles = useVehicles();
  const columns = useMemo(
    () => [
      {
        Header: <FormattedMessage id="app.Name" />,
        id: "name",
        accessor: (v: Vehicle) => v.name,
      },
      {
        Header: <FormattedMessage id="app.Type" />,
        id: "type",
        accessor: (v: Vehicle) => types.find((t) => t.id === v.type)?.name,
      },
      {
        Header: <FormattedMessage id="app.Driver" />,
        id: "driver",
        accessor: (v: Vehicle) => drivers.find((d) => d.id === v.driver)?.name,
      },
      {
        Header: <FormattedMessage id="app.Route" />,
        id: "route",
        accessor: (v: Vehicle) => v.route || "-",
      },
      {
        Header: <FormattedMessage id="app.Details" />,
        id: "details",
        accessor: (v) => (
          <Tooltip title={<FormattedMessage id="app.Details" />}>
            <Button component={Link} href={`/vehicles/${v.key}`}>
              <FormatListBulleted />
            </Button>
          </Tooltip>
        ),
      },
    ],
    []
  );

  // TODO : end day of payment

  if (vehicles?.[0].key === "loading") {
    return (
      <Box sx={sx.loading}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" sx={sx.padding}>
        <Typography variant="h6">
          <FormattedMessage id="app.Vehicles" />
        </Typography>
        <TextField
          variant="outlined"
          label={<FormattedMessage id="app.SearchVehicles" />}
          size="small"
        />
        <Button variant="contained" color="primary" startIcon={<Add />}>
          <FormattedMessage id="app.addVehicle" />
        </Button>
      </Box>
      {Array.isArray(vehicles) && vehicles.length > 0 && (
        <Table columns={columns} data={vehicles} name="vehicles" />
      )}
      {Array.isArray(vehicles) && vehicles.length === 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          style={{ height: "calc(100vh - 54px - 72px)" }}
        >
          <Typography variant="h5" sx={sx.padding}>
            <FormattedMessage id="app.noVehicles" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// export VehiclesView;
