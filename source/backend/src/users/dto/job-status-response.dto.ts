import { ApiProperty } from '@nestjs/swagger';

export class JobStatusResponseDto {
  @ApiProperty({
    description: 'The job ID',
    example: '12345'
  })
  jobId: string;

  @ApiProperty({
    description: 'The current status of the job',
    enum: ['waiting', 'active', 'completed', 'failed', 'delayed', 'stalled'],
    example: 'completed'
  })
  status: string;

  @ApiProperty({
    description: 'The progress of the job (0-100)',
    example: 100,
    required: false
  })
  progress?: number;

  @ApiProperty({
    description: 'The result of the job when completed',
    required: false,
    type: 'object',
    example: {
      totalUserRows: 150,
      newUsers: 45
    }
  })
  result?: {
    totalUserRows: number;
    newUsers: number;
  };

  @ApiProperty({
    description: 'Error message if the job failed',
    required: false,
    example: 'File processing failed'
  })
  error?: string;

  @ApiProperty({
    description: 'When the job was created',
    example: '2025-09-24T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the job was finished (if completed or failed)',
    required: false,
    example: '2025-09-24T10:35:00Z'
  })
  finishedAt?: Date;
}