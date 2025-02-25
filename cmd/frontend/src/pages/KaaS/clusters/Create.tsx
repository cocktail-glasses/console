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
  Paper,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import flow from "lodash/flow";
import head from "lodash/head";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import isString from "lodash/isString";
import map from "lodash/map";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router";
import {
  Close,
  ArrowBack,
  ArrowForward,
  Add,
  Delete,
  OpenInNew,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import "./create.scss";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormSchema } from "./formValidation";

interface StepData {
  label: string;
  content: ReactElement;
}

interface FormValue {
  cluster: ClusterFormValue;
  settings: SettingsFormValue;
}

export default function Create() {
  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormValue>();

  console.log(watch());
  console.log("root form errors: ", errors);

  const [hasError, setHasError] = useState(false);

  const stepDatas: StepData[] = [
    {
      label: "Cluster",
      content: (
        <Controller
          name="cluster"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ClusterForm
              values={value}
              handleSubmit={onChange}
              handleError={setHasError}
            />
          )}
        />
      ),
    },
    {
      label: "Settings",
      content: (
        <Controller
          name="settings"
          control={control}
          render={({ field: { onChange } }) => (
            <SettingForm handleSubmit={onChange} />
          )}
        />
      ),
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
      content: <SummaryForm formValue={getValues()} />,
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
    <Paper className="main-form">
      <h2>Create Cluster</h2>

      <ProgressStepper
        stepDatas={stepDatas}
        activeStepIndex={activeStepIndex}
      />

      <Box>{stepDatas[activeStepIndex].content}</Box>
      {JSON.stringify(hasError)}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<Close />}
          onClick={() => navigate("/kaas/clusters")}
        >
          Cancel
        </Button>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button
            variant="outlined"
            color="info"
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
              disabled={hasError}
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
    </Paper>
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

interface ClusterFormValue {
  name: string;
  sshKeys: string[];
  cniPlugin: string;
  cniPluginVersion: string;
  controlPlaneVersion: string;
  containerRuntime: string;
}

interface ClusterFormProps {
  values?: ClusterFormValue;
  handleSubmit?: (...event: any[]) => void;
  handleError?: (...event: any[]) => void;
}

const ClusterForm: React.FC<ClusterFormProps> = ({
  values,
  handleSubmit,
  handleError,
}) => {
  // cni plugins
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
  const handleSSHKeysChange = ({
    target: { value },
  }: SelectChangeEvent<string[]>) =>
    isString(value) ? value.split(",") : value;

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
    option?: ReactElement;
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
  const features: CheckBoxOption[] = [
    { label: "Audit Logging", value: "auditLoggin" },
    { label: "Disable CSI Driver", value: "disableCSIDriver" },
    { label: "Kubernetes Dashboard", value: "kubernetesDashboard" },
    { label: "OPA Integration", value: "opaIntegration" },
    { label: "User Cluster Logging", value: "userClusterLogging" },
    { label: "User Cluster Monitoring", value: "userClusterMonitoring" },
    { label: "User SSH Key Agent", value: "userSSHKeyAgent" },
  ];

  // forms
  const {
    watch,
    control,
    formState: { isValid },
  } = useForm<ClusterFormValue>({
    defaultValues: {
      name: values?.name || "",
      sshKeys: values?.sshKeys || [],
      cniPlugin: values?.cniPlugin,
      cniPluginVersion: values?.cniPluginVersion || head(ciliumVersions),
      controlPlaneVersion:
        values?.controlPlaneVersion || head(controlPlaneVersions),
      containerRuntime: values?.containerRuntime || head(containerRuntimes),
    },
    mode: "onChange",
    resolver: zodResolver(createFormSchema),
  });

  watch((data) => {
    if (isFunction(handleSubmit)) handleSubmit(data);

    if (isFunction(handleError)) handleError(isValid);
  });

  console.log(watch());

  return (
    <Box sx={{ display: "flex", gap: "25px" }}>
      <Box sx={{ flex: "1" }}>
        <h2>Clusters</h2>
        <Controller
          name="name"
          control={control}
          render={({
            field: { value, onChange },
            fieldState: { error, invalid },
          }) => (
            <FormControl fullWidth required error={invalid}>
              <TextField
                label="Name"
                variant="outlined"
                value={value}
                onChange={onChange}
              />
              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <h2>Network Configuration</h2>
        <Box sx={{ marginBottom: "22px" }}>
          <Controller
            name="cniPlugin"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ToggleButtonGroup
                value={value}
                exclusive
                className="cni-plugin-group"
                onChange={(_, selected) => onChange(selected)}
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
            )}
          />
        </Box>
        <Box sx={{ marginBottom: "10px" }}>
          <Controller
            name="cniPluginVersion"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth>
                <InputLabel id="cniPluginVersion" variant="outlined">
                  CNI Plugin Version
                </InputLabel>
                <Select
                  variant="outlined"
                  labelId="cniPluginVersion"
                  value={value}
                  onChange={onChange}
                  label="CNI Plugin Version"
                >
                  {map(ciliumVersions, (ciliumVersion) => (
                    <MenuItem value={ciliumVersion} key={ciliumVersion}>
                      {ciliumVersion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        <h2>SSH Keys</h2>
        <Box sx={{ marginBottom: "10px" }}>
          <Controller
            name="sshKeys"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth>
                <InputLabel id="sshKeys" variant="outlined">
                  SSH Keys
                </InputLabel>
                <Select
                  aria-label="sshKeys"
                  labelId="sshKeys"
                  variant="outlined"
                  multiple
                  value={value}
                  onChange={flow([handleSSHKeysChange, onChange])}
                  input={<OutlinedInput label="SSH Keys" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {map(sshKeys, (sshKey) => (
                    <MenuItem value={sshKey} key={sshKey}>
                      <Checkbox checked={value.includes(sshKey)} />
                      <ListItemText primary={sshKey} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
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

interface SettingsFormProps {
  values?: SettingsFormValue;
  handleSubmit?: (...event: any[]) => void;
}

interface SettingsFormValue {
  providerPreset: string;
  domain: string;
  credentialType: string;
  userName?: string;
  password?: string;
  securityGroup?: string;
}

const SettingForm: React.FC<SettingsFormProps> = ({ values, handleSubmit }) => {
  // forms
  const { watch, control } = useForm<SettingsFormValue>({
    defaultValues: {
      providerPreset: values?.providerPreset || "",
      credentialType: values?.credentialType || "userCredential",
      securityGroup: "",
    },
    mode: "onBlur",
  });

  watch((data) => {
    if (isFunction(handleSubmit)) handleSubmit(data);
  });

  // provider preset
  const providerPresets: string[] = ["cocktail-preset"];

  // user credential password
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  return (
    <Box sx={{ display: "flex", gap: "25px" }}>
      <Box sx={{ flex: 1 }}>
        <h2>Basic Settings</h2>
        <Box sx={{ marginBottom: "10px" }}>
          <Controller
            name="providerPreset"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth>
                <InputLabel id="providerPreset" variant="outlined" required>
                  Provider Preset
                </InputLabel>
                <Select
                  variant="outlined"
                  labelId="providerPreset"
                  value={value}
                  onChange={onChange}
                  label="Provider Preset"
                  required
                >
                  {map(providerPresets, (providerPreset) => (
                    <MenuItem value={providerPreset} key={providerPreset}>
                      {providerPreset}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Using provider presets will disable most of the other
                  provider-related fields.
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>
        <Box sx={{ marginBottom: "10px" }}>
          <Controller
            name="domain"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                label="Domain"
                variant="outlined"
                required
                fullWidth
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Box>
        <Box sx={{ marginBottom: "10px" }}>
          <Controller
            name="credentialType"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ToggleButtonGroup
                color="primary"
                value={value}
                exclusive
                onChange={(_, select) => onChange(select)}
                aria-label="credentialType"
              >
                <ToggleButton value="userCredential">
                  User Credential
                </ToggleButton>
                <ToggleButton value="applicationCredential">
                  Application Credential
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>
        <Box sx={{ marginBottom: "10px" }}>
          <Controller
            name="userName"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                label="Username"
                variant="outlined"
                required
                fullWidth
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Box>
        <Box sx={{ marginBottom: "10px" }}>
          <Controller
            name="password"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl variant="outlined">
                <InputLabel htmlFor="password" required>
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  type={isPasswordShow ? "text" : "password"}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          setIsPasswordShow((prev) => !prev);
                        }}
                        edge="end"
                      >
                        {isPasswordShow ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  value={value}
                  onChange={onChange}
                />
              </FormControl>
            )}
          />
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <h2>Advanced Settings</h2>
        <Box sx={{ marginBottom: "10px" }}>
          <Controller
            name="securityGroup"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth disabled>
                <InputLabel id="providerPreset" variant="outlined" disabled>
                  No Security Groups Available
                </InputLabel>
                <Select
                  variant="outlined"
                  labelId="providerPreset"
                  value={value}
                  onChange={onChange}
                  label="Provider Preset"
                  disabled
                ></Select>
                <FormHelperText>
                  Please enter your credentials first.
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>
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

interface SummaryFormProps {
  formValue: FormValue;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ formValue }) => {
  interface SummaryGroup extends Array<Step> {}
  interface SummaryLayout extends Array<SummaryGroup> {}

  const summaryData: SummaryLayout = [
    [
      {
        title: "Cluster",
        index: 1,
        sub: [
          {
            title: "GENERAL",
            contents: [
              ["Name", formValue.cluster.name],
              ["Version", formValue.cluster.controlPlaneVersion],
              ["Container Runtime", formValue.cluster.containerRuntime],
              [
                "SSH Keys",
                isEmpty(formValue.cluster.sshKeys)
                  ? "No assigned keys"
                  : formValue.cluster.sshKeys.join(", "),
              ],
            ],
          },

          {
            title: "NETWORK CONFIGURATION",
            contents: [
              ["CNI Plugin", formValue.cluster.cniPlugin],
              ["CNI Plugin Version", formValue.cluster.cniPluginVersion],
              ["Proxy Mode", "ebpf"],
              ["Expose Strategy", "NodePort"],
              ["Allowed IP Ranges for Node Ports", undefined],
              ["Services CIDR", "10.240.16.0/20"],
              ["Node CIDR Mask Size", "24"],
            ],
          },

          {
            title: "SPECIFICATION",
            contents: [["User SSH Key Agent", undefined]],
          },

          {
            title: "ADMISSION PLUGINS",
            contents: [["User SSH Key Agent", undefined]],
          },
        ],
      },
      {
        title: "Settings",
        index: 2,
        contents: [["Preset", "cocktail-preset"]],
      },
      {
        title: "Static Nodes",
        index: 3,
      },
    ],
    [
      {
        title: "Applications",
        index: 4,
      },
    ],
  ];

  return (
    <Box className="summary">
      {map(summaryData, (group, groupIndex) => (
        <Box className="group" key={groupIndex}>
          {map(group, (step) => (
            <SummaryStep key={step.title} stepData={step} />
          ))}
        </Box>
      ))}
    </Box>
  );
};

interface Step {
  title: string;
  index: number;
  contents?: any[];
  sub?: any[];
}

interface SummaryStepProps {
  stepData: Step;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ stepData }) => (
  <Box className="step">
    <Typography className={`header counter-${stepData.index}`} gutterBottom>
      {stepData.title}
    </Typography>

    {map(stepData.sub, (sub) => (
      <Box sx={{ paddingBottom: "24px" }} key={sub.title}>
        <Typography variant="subtitle1" sx={{ marginBottom: "14px" }}>
          {sub.title}
        </Typography>

        <Box className="content">
          {map(sub.contents, (content) => (
            <SummaryItem
              key={content[0]}
              label={content[0]}
              value={content[1]}
            />
          ))}
        </Box>
      </Box>
    ))}

    {map(stepData.contents, (content) => (
      <SummaryItem key={content[0]} label={content[0]} value={content[1]} />
    ))}
  </Box>
);

interface SummaryItemProp {
  label: string;
  value?: any;
}

const SummaryItem: React.FC<SummaryItemProp> = ({ label, value }) => (
  <Box className="item">
    <Typography className="label" variant="caption" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body1" gutterBottom>
      {value}
    </Typography>
  </Box>
);
