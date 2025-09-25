import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { loadPersist, savePersist } from "./storage";
import type { Field, Sample } from "./types";
import SamplePanel from "./components/SamplePanel";
import FieldPanel from "./components/FieldPanel";

export default function App() {
  const persisted = loadPersist();
  const [samples, setSamples] = useState<Sample[]>(persisted.samples);
  const [fields, setFields] = useState<Field[]>(persisted.fields);

  useEffect(() => {
    savePersist({ samples, fields });
  }, [samples, fields]);

  // Selected items for UI
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(
    samples.length ? samples[0].id : null
  );

  useEffect(() => {
    if (!selectedSampleId && samples.length) setSelectedSampleId(samples[0].id);
    if (selectedSampleId && !samples.find(s => s.id === selectedSampleId))
      setSelectedSampleId(samples[0]?.id ?? null);
  }, [samples, selectedSampleId]);

  return (
    <Box className="app-root">
      <Box className="panel left">
        <Typography variant="h6">Samples</Typography>
        <Divider sx={{ my: 1 }} />
        <SamplePanel
          samples={samples}
          onChange={setSamples}
          selectedId={selectedSampleId}
          onSelect={setSelectedSampleId}
        />
      </Box>

      <Box className="panel center">
        <Typography variant="h6">Fields for sample: {selectedSampleId}</Typography>
        <Divider sx={{ my: 1 }} />
        <FieldPanel
          fields={fields}
          onChange={setFields}
        />
      </Box>

      <Box className="panel right">
        <Typography variant="h6">Preview / Notes</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          이 패널은 미리보기나 시료별 필드 적용 예시를 보여주기 위해 비워두었습니다.
          필요하면 시료-필드-값 관계를 추가해서 시료별 입력값 저장/편집 기능도 확장할 수 있습니다.
        </Typography>
      </Box>
    </Box>
  );
}
