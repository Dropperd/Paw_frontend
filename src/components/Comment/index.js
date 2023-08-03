import React from "react";
import { Group, Text, Space } from "@mantine/core";

const Comment = ({ author, body, postedAt }) => {
  return (
    <div>
      <Space h="md" />
      <Group>
        <div>
          <Text size="sm">Clinical: {author}</Text>
          <Text size="xs" color="dimmed">
            Date:{postedAt}
          </Text>
        </div>
      </Group>
      <Text size="sm">{body}</Text>
    </div>
  );
};

export default Comment;
