import React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Sample } from "../types";
import { uid } from "../utils";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface Props {
    samples: Sample[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onChange: (s: Sample[]) => void;
}

export default function SamplePanel({ samples, selectedId, onSelect, onChange }: Props) {
    const addSample = () => {
        const name = prompt("새 시료 이름을 입력하세요", `sample-${samples.length + 1}`);
        if (!name) return;
        const newS = { id: uid("s-"), name };
        onChange([...samples, newS]);
        onSelect(newS.id);
    };

    const removeSample = (id: string) => {
        if (!confirm("삭제하시겠습니까?")) return;
        onChange(samples.filter(s => s.id !== id));
        if (selectedId === id) onSelect(null);
    };

    const renameSample = (id: string) => {
        const s = samples.find(x => x.id === id);
        if (!s) return;
        const name = prompt("이름 변경:", s.name);
        if (!name) return;
        onChange(samples.map(x => x.id === id ? { ...x, name } : x));
    };

    return (
        <div>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={addSample}>
                    Add
                </Button>
                <Button variant="outlined" size="small" onClick={() => {
                    const dump = JSON.stringify(samples, null, 2);
                    alert(dump);
                }}>Export</Button>
            </Box>

            <List dense>
                {samples.map((s) => (
                    <ListItemButton
                        key={s.id}
                        selected={s.id === selectedId}
                        onClick={() => onSelect(s.id)}
                        secondaryAction={
                            <Stack direction="row" spacing={0.5}>
                                <IconButton size="small" onClick={() => renameSample(s.id)}><EditIcon fontSize="small" /></IconButton>
                                <IconButton size="small" onClick={() => removeSample(s.id)}><DeleteIcon fontSize="small" /></IconButton>
                            </Stack>
                        }>
                        <ListItemText primary={s.name} secondary={s.id} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    );
}
