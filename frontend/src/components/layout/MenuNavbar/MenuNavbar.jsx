import Navbar from "../Navbar/Navbar";
import { Drawer } from "@mantine/core";

export function MenuNavbar({ opened, close, activeSportId, onSportSelect }) {
  return (
    <Drawer
      opened={opened}
      onClose={close}
      size="xs"
      padding="md"
      title="Menu"
      hiddenFrom="sm"
    >
      <Navbar onNavigate={close} activeSportId={activeSportId} onSportSelect={onSportSelect} />
    </Drawer>
  )
}