import Navbar from "../Navbar/Navbar";
import { Drawer } from "@mantine/core";

export function MenuNavbar({ opened, close }) {
  return (
    <Drawer
      opened={opened}
      onClose={close}
      size="xs"
      padding="md"
      title="Menu"
      hiddenFrom="sm"
    >
      <Navbar onNavigate={close} />
    </Drawer>
  )
}