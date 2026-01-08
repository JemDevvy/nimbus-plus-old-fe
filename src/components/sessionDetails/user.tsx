import React from 'react';

// Example props: pass user object as prop
export interface UserDetailsProps {
  user: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    // add more fields as needed
  };
  size?: number;
}

import { Box, Typography, Avatar } from '@mui/material';

export const UserDetails: React.FC<UserDetailsProps> = ({ user, size = 40 }) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Avatar src={user.avatarUrl} sx={{ width: size, height: size }}>
        {user.name ? user.name[0] : '?'}
      </Avatar>
      <Box>
        <Typography variant="subtitle2">{user.name || 'User'}</Typography>
        {user.email && (
          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
        )}
      </Box>
    </Box>
  );
};
