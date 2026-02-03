import React from 'react'

import {
  Skeleton,
  Box
} from '@mui/material'

/**
 * Base configuration for Skeletons to ensure consistent dark mode styling
 */
const SKELETON_COLOR = 'rgba(255, 255, 255, 0.08)' // Slightly lighter than background

const BaseSkeleton = ({ sx, ...props }) => (
  <Skeleton
    animation="wave"
    sx={{
      bgcolor: SKELETON_COLOR,
      ...sx,
    }}
    {...props}
  />
)

/**
 * Skeleton for user avatars
 */
export const SkeletonAvatar = ({ size = 32, sx }) => (
  <BaseSkeleton
    variant="circular"
    width={size}
    height={size}
    sx={sx}
  />
)

/**
 * Skeleton for text/headings
 * variants: 'text', 'rectangular', 'rounded'
 */
export const SkeletonText = ({
  variant = 'text',
  width = '100%',
  height,
  sx,
  lines = 1
}) => {
  if (lines > 1) {
    return (
      <Box sx={{ width, ...sx }}>
        {Array.from(new Array(lines)).map((_, index) => (
          <BaseSkeleton
            key={index}
            variant='rounded'
            width={index === lines - 1 && lines > 1 ? '70%' : '100%'} // Last line shorter
            height={height}
            sx={{ mb: 0.5 }}
          />
        ))}
      </Box>
    )
  }
  return (
    <BaseSkeleton
      variant={variant}
      width={width}
      height={height}
      sx={sx}
    />
  )
}

/**
 * Skeleton for generic rectangular blocks (cards, buttons)
 */
export const SkeletonRect = ({
  width,
  height,
  radius = 4,
  sx
}) => (
  <BaseSkeleton
    variant="rectangular"
    width={width}
    height={height}
    sx={{
      borderRadius: radius,
      ...sx,
    }}
  />
)

/**
 * Skeleton mimicking a Song Card
 */
export const SkeletonSongCard = () => (
  <Box sx={{
    width: '100%',
    p: 2,
    bgcolor: '#18181b',
    borderRadius: 2
  }}>
    <SkeletonRect
      width="100%"
      height={0}
      sx={{
        pb: '100%',
        mb: 2,
        borderRadius: 2
      }}
    />
    <SkeletonText
      variant="rounded"
      height={20}
      width="80%"
      sx={{ mb: 1 }}
    />
    <SkeletonText
      variant="rounded"
      height={16}
      width="50%"
    />
  </Box>
)

/**
 * Skeleton for Main Layout Structure (Sidebar + Header + Content)
 */
export const SkeletonLayout = () => {
  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      bgcolor: '#000'
    }}>
      {/* Sidebar Skeleton */}
      <Box sx={{
        width: 240,
        height: '100%',
        bgcolor: '#18181b',
        borderRight: '1px solid #27272a',
        p: 3,
        display: { xs: 'none', md: 'block' }
      }}>
        <SkeletonText
          variant="rounded"
          height={32}
          width={120}
          sx={{ mb: 5 }}
        />
        <SkeletonText
          variant="rounded"
          lines={6}
          height={20}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Main Content Skeleton */}
      <Box sx={{
        flex: 1,
        bgcolor: '#09090b',
        p: 3,
        overflow: 'hidden'
      }}>
        {/* Header Area */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 4
        }}>
          <SkeletonRect
            width={200}
            height={40}
            radius={8}
          />
          <SkeletonAvatar size={40} />
        </Box>

        {/* Grid Content */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 3
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Box
              key={item}
              sx={{
                p: 2,
                bgcolor: '#18181b',
                borderRadius: 2
              }}
            >
              {/* Aspect Ratio Box for Image */}
              <SkeletonRect
                width="100%"
                height={0}
                sx={{
                  pb: '100%',
                  mb: 2,
                  borderRadius: 1
                }}
              />
              <SkeletonText
                height={16}
                width="90%"
                sx={{ mb: 1 }}
              />
              <SkeletonText
                height={14}
                width="60%"
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
