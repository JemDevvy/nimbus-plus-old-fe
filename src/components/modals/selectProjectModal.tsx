import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useProjectSelection } from "../../hooks/useProjectSelection";

interface SelectProjectModalProps {
  open: boolean;
  projectList: Array<{ id: string | number; name: string }>;
  selectedProject: string | number | null;
  onSelect: (projectId: string | number) => void;
  onClose?: () => void;
}

const SelectProjectModal: React.FC<SelectProjectModalProps> = ({
  open,
  projectList,
  selectedProject,
  onSelect,
  onClose,
}) => {
  const [localSelected, setLocalSelected] = React.useState<string | number | null>(selectedProject);

  const { setSelectedProject } = useProjectSelection();

  React.useEffect(() => {
    setLocalSelected(selectedProject);
  }, [selectedProject]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLocalSelected(event.target.value as string | number);
  };

  const handleSelect = () => {
    if (localSelected) {
      onSelect(localSelected);
      setSelectedProject(localSelected.toString());
      if (onClose) onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth disableEscapeKeyDown>
      <DialogTitle>Select a Project</DialogTitle>
      <DialogContent>
        <FormControl sx={{ mt: 2 }} fullWidth>
          <InputLabel id="select-project-label" >Project</InputLabel>
          <Select
            labelId="select-project-label"
            value={localSelected ?? ""}
            label="Project"
            onChange={handleChange}
          >
            {projectList.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSelect}
          variant="contained"
          disabled={!localSelected}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectProjectModal;