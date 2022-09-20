import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Session } from "next-auth";
import { FC } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { useSettingsContext } from "../../contexts/settings";
import { UserType } from "../../prisma/enums";
import { ClientUserData } from "../../authUtils";
import defaultGetSSProps from "./defaultGetSSProps";
import styles from "./settings.module.css";

interface SettingsProps {
  session: Session;
}

const Settings: FC<SettingsProps> = ({ session }) => {
  const { settings, setSettings } = useSettingsContext();

  return (
    <DashboardShell session={session}>
      <span className={`${styles.header}`}>Settings:</span>
      <div>
        <FormControl fullWidth>
          <InputLabel id="Use-As-label">Use As</InputLabel>
          <Select
            labelId="Use-As-label"
            id="Use-As"
            value={
              settings.clientDeEscalation ??
              (session.user as ClientUserData).type
            }
            label="Use As"
            onChange={(e) => {
              setSettings({
                ...settings,
                clientDeEscalation: +e.target.value,
              });
            }}
          >
            {Object.values(UserType)
              .filter(
                (_, index) => index <= (session.user as ClientUserData).type
              )
              .map((type, index) => (
                <MenuItem key={index} value={index}>
                  {type}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
    </DashboardShell>
  );
};

export const getServerSideProps = defaultGetSSProps;

export default Settings;
