import { Box, Text, Timeline } from "@mantine/core";

export interface HistoryEntry {
  name: string;
}

export interface HistoryProps {
  history: Array<HistoryEntry>;
  revision: number;
}

export default function History({ history, revision }: HistoryProps) {
  return (
    <Box mx="1.5rem">
      <Timeline lineWidth={1} active={revision - 1} reverseActive bulletSize={12}>
        {history.reverse().map((h, index) => (
          <Timeline.Item key={index}>
            <Text size="xs" mt={4}>
              {h.name}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Box>
  );
}
