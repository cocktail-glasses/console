import {
  Box,
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { head, map } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Close,
  ArrowBack,
  ArrowForward,
  Add,
  Delete,
  OpenInNew,
} from "@mui/icons-material";
import "./create.scss";

interface StepData {
  label: string;
  content: React.ReactNode;
}

export default function Create() {
  const stepDatas: StepData[] = [
    {
      label: "Cluster",
      content: <ClusterForm />,
    },
    {
      label: "Settings",
      content: <SettingForm />,
    },
    {
      label: "Static Nodes",
      content: <StaticNodeForm />,
    },
    {
      label: "Applications",
      content: <ApplicationsForm />,
    },
    {
      label: "Summary",
      content: <SummaryForm />,
    },
  ];
  const [activeStepIndex, setActiveStep] = useState(0);

  const hasBack = (currentStepIndex: number) => currentStepIndex > 0;
  const hasNext = (currentStepIndex: number, totalStepSize: number) =>
    currentStepIndex < totalStepSize - 1;
  const handleBack = (currentStepIndex: number) =>
    hasBack(currentStepIndex) && setActiveStep((prev) => prev - 1);
  const handleNext = (currentStepIndex: number) =>
    hasNext(currentStepIndex, stepDatas.length) &&
    setActiveStep((prev) => prev + 1);

  const navigate = useNavigate();

  return (
    <Box sx={{ padding: "50px" }}>
      <ProgressStepper
        stepDatas={stepDatas}
        activeStepIndex={activeStepIndex}
      />

      <Box>{stepDatas[activeStepIndex].content}</Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <Button
          variant="outlined"
          color="success"
          size="large"
          startIcon={<Close />}
          onClick={() => navigate("/kaas/clusters")}
        >
          Cancel
        </Button>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button
            variant="outlined"
            color="success"
            size="large"
            startIcon={<ArrowBack />}
            disabled={!hasBack(activeStepIndex)}
            onClick={() => handleBack(activeStepIndex)}
          >
            Back
          </Button>

          {hasNext(activeStepIndex, stepDatas.length) ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowForward />}
              onClick={() => handleNext(activeStepIndex)}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => handleNext(activeStepIndex)}
            >
              Create Cluster
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

interface ProgressStepperProps {
  stepDatas: StepData[];
  activeStepIndex: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  stepDatas,
  activeStepIndex,
}) => {
  return (
    <Stepper activeStep={activeStepIndex}>
      {map(stepDatas, (stepData) => (
        <Step key={stepData.label}>
          <StepLabel>{stepData.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

const ClusterForm = () => {
  // cni plugins
  const [cniPlugin, setCniPlugin] = useState();
  const ciliumVersions: string[] = ["1.15.3", "1.14.9", "1.13.14"];

  // sshkeys
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const sshKeys: string[] = ["cocktail", "openstack"];
  const [selectedSSHKeys, setSelectedSSHKeys] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof selectedSSHKeys>) => {
    const {
      target: { value },
    } = event;
    setSelectedSSHKeys(typeof value === "string" ? value.split(",") : value);
  };

  // control plane version
  const controlPlaneVersions: string[] = [
    "1.30.0",
    "1.29.4",
    "1.29.2",
    "1.29.1",
    "1.29.0",
  ];

  // container runtime
  const containerRuntimes: string[] = ["containerd"];

  // admission plugins
  interface CheckBoxOption {
    label: string;
    value: string;
  }

  const admissionPlugins: CheckBoxOption[] = [
    { label: "Event Rate Limit", value: "eventRateLimit" },
    { label: "Pod Node Selector", value: "podNodeSelector" },
  ];
  const [selectedAdmissionPlugins, setSelectedAdmissionPlugins] = useState<
    string[]
  >([]);
  const handleAdmissionPlugins = (
    event: SelectChangeEvent<typeof selectedAdmissionPlugins>,
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedAdmissionPlugins(
      typeof value === "string" ? value.split(",") : value,
    );
  };

  // checkboxes
  interface CheckBox {
    label: string;
    value: string;
  }

  const features: CheckBox[] = [
    { label: "Audit Logging", value: "auditLoggin" },
    { label: "Disable CSI Driver", value: "disableCSIDriver" },
    { label: "Kubernetes Dashboard", value: "kubernetesDashboard" },
    { label: "OPA Integration", value: "opaIntegration" },
    { label: "User Cluster Logging", value: "userClusterLogging" },
    { label: "User Cluster Monitoring", value: "userClusterMonitoring" },
    { label: "User SSH Key Agent", value: "userSSHKeyAgent" },
  ];

  return (
    <Box sx={{ display: "flex", gap: "25px" }}>
      <Box sx={{ flex: "1" }}>
        <h2>Clusters</h2>
        <TextField label="Name" variant="outlined" required fullWidth />

        <h2>Network Configuration</h2>
        <Box sx={{ marginBottom: "22px" }}>
          <ToggleButtonGroup
            value={cniPlugin}
            exclusive
            onChange={(_, selectedCniPlugin) => setCniPlugin(selectedCniPlugin)}
            className="cni-plugin-group"
          >
            <ToggleButton value="cilium" className="cni-plugin">
              <span className="plugin-image cilium" />
            </ToggleButton>

            <ToggleButton value="canal" className="cni-plugin">
              <span className="plugin-image canal" />
            </ToggleButton>

            <ToggleButton value="none" className="cni-plugin">
              None
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ marginBottom: "10px" }}>
          <FormControl fullWidth>
            <InputLabel id="cniPluginVersion" variant="outlined">
              CNI Plugin Version
            </InputLabel>
            <Select
              variant="outlined"
              labelId="cniPluginVersion"
              defaultValue={head(ciliumVersions)}
              label="CNI Plugin Version"
            >
              {map(ciliumVersions, (ciliumVersion) => (
                <MenuItem value={ciliumVersion} key={ciliumVersion}>
                  {ciliumVersion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <h2>SSH Keys</h2>
        <Box sx={{ marginBottom: "10px" }}>
          <FormControl fullWidth>
            <InputLabel id="sshkeys" variant="outlined">
              SSH Keys
            </InputLabel>
            <Select
              variant="outlined"
              labelId="sshkeys"
              multiple
              value={selectedSSHKeys}
              onChange={handleChange}
              input={<OutlinedInput label="SSH Keys" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {map(sshKeys, (sshKey) => (
                <MenuItem value={sshKey} key={sshKey}>
                  <Checkbox checked={selectedSSHKeys.includes(sshKey)} />
                  <ListItemText primary={sshKey} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="success"
            size="large"
            startIcon={<Add />}
          >
            Add SSH Key
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: "1" }}>
        <h2>Specification</h2>
        <Box sx={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <FormControl fullWidth>
            <InputLabel id="controlPlaneVersion" variant="outlined" required>
              Control Plane Version
            </InputLabel>
            <Select
              variant="outlined"
              labelId="controlPlaneVersion"
              label="Control Plane Version"
              defaultValue={head(controlPlaneVersions)}
              required
            >
              {map(controlPlaneVersions, (controlPlaneVersion) => (
                <MenuItem value={controlPlaneVersion} key={controlPlaneVersion}>
                  {controlPlaneVersion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="containerRuntime" variant="outlined" required>
              Container Runtime
            </InputLabel>
            <Select
              variant="outlined"
              labelId="containerRuntime"
              label="Container Runtime"
              value={head(containerRuntimes)}
              required
              disabled
            >
              {map(containerRuntimes, (containerRuntime) => (
                <MenuItem value={containerRuntime} key={containerRuntime}>
                  {containerRuntime}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: "30px" }}>
          <FormControl fullWidth>
            <InputLabel id="admissionPlugins" variant="outlined">
              Admission Plugins
            </InputLabel>
            <Select
              variant="outlined"
              labelId="admissionPlugins"
              multiple
              value={selectedAdmissionPlugins}
              onChange={handleAdmissionPlugins}
              input={<OutlinedInput label="Admission Plugins" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {map(admissionPlugins, (admissionPlugin) => (
                <MenuItem
                  value={admissionPlugin.value}
                  key={admissionPlugin.value}
                >
                  <Checkbox
                    checked={selectedAdmissionPlugins.includes(
                      admissionPlugin.value,
                    )}
                  />
                  <ListItemText primary={admissionPlugin.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ marginBottom: "30px" }}>
          <FormGroup>
            {map(features, (feature) => (
              <FormControlLabel
                control={<Checkbox name={feature.value} />}
                label={feature.label}
                key={feature.value}
              />
            ))}
          </FormGroup>
        </Box>

        <Box sx={{ marginBottom: "30px" }}>
          <h2>Labels</h2>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <TextField label="Key" variant="outlined" fullWidth />
            <TextField label="Value" variant="outlined" fullWidth />
            <IconButton aria-label="delete" size="large" disabled>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const SettingForm = () => {
  return (
    <Box sx={{ display: "flex", gap: "25px" }}>
      <Box sx={{ flex: 1 }}>
        <h2>Basic Settings</h2>
      </Box>
      <Box sx={{ flex: 1 }}>
        <h2>Advanced Settings</h2>
      </Box>
    </Box>
  );
};

const StaticNodeForm = () => {
  return <p>static node</p>;
};

const ApplicationsForm = () => {
  return (
    <Box>
      <h2>Applications to Install</h2>
      <p>
        No application selected to install on cluster creation,{" "}
        <Link sx={{ display: "inline-flex", alignItems: "center" }}>
          learn more about Applicaitons
          <OpenInNew sx={{ fontSize: 15 }} />
        </Link>
      </p>
    </Box>
  );
};

const SummaryForm = () => {
  return (
    <Box className="summary">
      <Box className="group">
        <Box className="step">
          <Typography className="header counter-1" gutterBottom>
            Cluster
          </Typography>

          <Box sx={{ paddingBottom: "24px" }}>
            <Typography variant="subtitle1" sx={{ marginBottom: "14px" }}>
              GENERAL
            </Typography>

            <Box className="content">
              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  nostalgic-wozniak
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Version
                </Typography>
                <Typography variant="body1" gutterBottom>
                  1.29.4
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Container Runtime
                </Typography>
                <Typography variant="body1" gutterBottom>
                  containerd
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  SSH Keys
                </Typography>
                <Typography variant="body1" gutterBottom>
                  No assigned keys
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ paddingBottom: "24px" }}>
            <Typography variant="subtitle1" sx={{ marginBottom: "14px" }}>
              NETWORK CONFIGURATION
            </Typography>

            <Box className="content">
              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  CNI Plugin
                </Typography>
                <Typography variant="body1" gutterBottom>
                  cilium
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  CNI Plugin Version
                </Typography>
                <Typography variant="body1" gutterBottom>
                  1.15.3
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Proxy Mode
                </Typography>
                <Typography variant="body1" gutterBottom>
                  ebpf
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Expose Strategy
                </Typography>
                <Typography variant="body1" gutterBottom>
                  NodePort
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Expose Strategy
                </Typography>
                <Typography variant="body1" gutterBottom>
                  NodePort
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Allowed IP Ranges for Node Ports
                </Typography>
                <Typography variant="body1" gutterBottom></Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Services CIDR
                </Typography>
                <Typography variant="body1" gutterBottom>
                  10.240.16.0/20
                </Typography>
              </Box>

              <Box className="item">
                <Typography className="label" variant="caption" gutterBottom>
                  Node CIDR Mask Size
                </Typography>
                <Typography variant="body1" gutterBottom>
                  24
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="step">
          <Typography className="header counter-2">Settings</Typography>
        </Box>

        <Box className="step">
          <Typography className="header counter-3">Static Nodes</Typography>
        </Box>
      </Box>
      <Box className="group">
        <Box className="step">
          <Typography className="header counter-4">Applications</Typography>
        </Box>
      </Box>
    </Box>
  );
};
