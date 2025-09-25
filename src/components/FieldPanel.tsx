import React, { useState } from "react";
import type { Field, FieldOption } from "../types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { uid } from "../utils";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

interface Props {
    fields: Field[];
    onChange: (f: Field[]) => void;
}

export default function FieldPanel({ fields, onChange }: Props) {
    const [editing, setEditing] = useState<Field | null>(null);
    const [open, setOpen] = useState(false);

    const openEditor = (f?: Field) => {
        setEditing(f ? JSON.parse(JSON.stringify(f)) : {
            id: uid("f-"),
            label: "",
            type: "text",
            visible: true,
            options: []
        });
        setOpen(true);
    };
    const closeEditor = () => { setOpen(false); setEditing(null); };

    const save = () => {
        if (!editing) return;
        if (!editing.label.trim()) { alert("Label을 입력하세요"); return; }

        const exists = fields.find(x => x.id === editing.id);
        if (exists) {
            onChange(fields.map(f => f.id === editing.id ? editing : f));
        } else {
            onChange([...fields, editing]);
        }
        closeEditor();
    };

    const removeField = (id: string) => {
        if (!confirm("필드를 삭제하시겠습니까?")) return;
        onChange(fields.filter(f => f.id !== id));
    };

    const toggleVisible = (f: Field) => {
        onChange(fields.map(x => x.id === f.id ? { ...x, visible: !x.visible } : x));
    };

    const addOption = () => {
        if (!editing) return;
        const nextIndex = editing.options.length ? Math.max(...editing.options.map(o => o.index)) + 1 : 1;
        const newOpt: FieldOption = { id: uid("o-"), index: nextIndex, value: `옵션${nextIndex}` };
        setEditing({ ...editing, options: [...editing.options, newOpt] });
    };

    const updateOption = (optId: string, value: string) => {
        if (!editing) return;
        setEditing({
            ...editing,
            options: editing.options.map(o => o.id === optId ? { ...o, value } : o)
        });
    };

    const removeOption = (optId: string) => {
        if (!editing) return;
        setEditing({
            ...editing,
            options: editing.options.filter(o => o.id !== optId)
        });
    };

    return (
        <Box>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => openEditor()}>필드 추가</Button>
                <Button variant="outlined" onClick={() => {
                    const dump = JSON.stringify(fields, null, 2);
                    alert(dump);
                }}>Export Fields</Button>
            </Box>

            <List>
                {fields.map(f => (
                    <Box key={f.id} sx={{ mb: 1, borderRadius: 1, border: "1px solid #eee", p: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography variant="subtitle1">{f.label} <Chip size="small" label={f.type} sx={{ ml: 1 }} /></Typography>
                                <Typography variant="caption" color="text.secondary">{f.id}</Typography>
                            </Box>

                            <Box>
                                <Switch checked={f.visible} onChange={() => toggleVisible(f)} />
                                <IconButton size="small" onClick={() => openEditor(f)}><EditIcon fontSize="small" /></IconButton>
                                <IconButton size="small" onClick={() => removeField(f.id)}><DeleteIcon fontSize="small" /></IconButton>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                            {f.options.length ? f.options.map(o => <Chip key={o.id} label={o.value} />) : <Typography variant="body2" color="text.secondary">옵션 없음</Typography>}
                        </Stack>
                    </Box>
                ))}
            </List>

            {/* Editor Dialog */}
            <Dialog open={open} onClose={closeEditor} maxWidth="sm" fullWidth>
                <DialogTitle>{editing?.id ? (fields.find(x => x.id === editing?.id) ? "필드 편집" : "필드 추가") : "필드"}</DialogTitle>
                <DialogContent>
                    {editing && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField label="Label" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} fullWidth />
                            <TextField
                                select
                                label="Type"
                                value={editing.type}
                                onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}
                            >
                                <MenuItem value="select">select</MenuItem>
                                <MenuItem value="text">text</MenuItem>
                                <MenuItem value="checkbox">checkbox</MenuItem>
                                <MenuItem value="radio">radio</MenuItem>
                            </TextField>

                            <Box>
                                <Typography variant="subtitle2">Visible</Typography>
                                <Switch checked={editing.visible} onChange={() => setEditing({ ...editing, visible: !editing.visible })} />
                            </Box>

                            {/* Options: only for select/checkbox/radio */}
                            {editing.type !== "text" && (
                                <Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                        <Typography variant="subtitle1">Options</Typography>
                                        <Button size="small" variant="outlined" onClick={addOption} startIcon={<AddIcon />}>옵션 추가</Button>
                                    </Box>

                                    <Stack spacing={1}>
                                        {editing.options.map(o => (
                                            <Box key={o.id} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                <TextField value={o.value} onChange={(e) => updateOption(o.id, e.target.value)} size="small" fullWidth />
                                                <Button color="error" size="small" onClick={() => removeOption(o.id)}>삭제</Button>
                                            </Box>
                                        ))}
                                        {editing.options.length === 0 && <Typography variant="body2" color="text.secondary">옵션이 없습니다.</Typography>}
                                    </Stack>
                                </Box>
                            )}

                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <Button onClick={closeEditor}>취소</Button>
                                <Button variant="contained" onClick={save}>저장</Button>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
