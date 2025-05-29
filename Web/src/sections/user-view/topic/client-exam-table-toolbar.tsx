import { useState, useCallback } from "react";

import { Grid, Button, TextField } from "@mui/material";

import { TypeSkill } from "../../../types/enum";
import { ITopicsFilters, ITopicsFilterValue } from "../../../types/topic";

type Props = {
  filters: ITopicsFilters;
  onFilters: (name: string, value: ITopicsFilterValue) => void;
};

export default function ClientExamTableToolbar({ onFilters }: Props) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const allSkills = Object.keys(TypeSkill);
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("search", event.target.value);
    },
    [onFilters]
  );

  const handleFilterSkill = (skill: string) => {
    setSelectedSkills((prevSelectedSkills) => {
      const isSelected = prevSelectedSkills.includes(skill);
      const updatedSkills = isSelected
        ? prevSelectedSkills.filter((s) => s !== skill)
        : [...prevSelectedSkills, skill];

      onFilters("skill", updatedSkills);
      return updatedSkills;
    });
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 3, sm: 3, md: 7 }}
    >
      <Grid item xs={1}>
        <Button onClick={() => setSelectedSkills([])}>Tất cả</Button>
      </Grid>
      {allSkills.map((skill, index) => (
        <Grid item xs={1} key={index}>
          <Button
            variant={!selectedSkills.includes(skill) ? "text" : "contained"}
            onClick={() => handleFilterSkill(skill)}
          >
            {skill}
          </Button>
        </Grid>
      ))}
      <Grid item xs={4}>
        <TextField onChange={handleSearch} label="Search" fullWidth />
      </Grid>
    </Grid>
  );
}
