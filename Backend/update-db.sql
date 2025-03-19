USE TaskManagementDB;

-- Check if Status column exists, if not add it
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tasks' AND COLUMN_NAME = 'Status')
BEGIN
    ALTER TABLE Tasks ADD Status nvarchar(50) NULL;
    PRINT 'Added Status column';
END
ELSE
BEGIN
    PRINT 'Status column already exists';
END

-- Check if CreatedAt column exists, if not add it
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tasks' AND COLUMN_NAME = 'CreatedAt')
BEGIN
    ALTER TABLE Tasks ADD CreatedAt nvarchar(100) NULL;
    PRINT 'Added CreatedAt column';
END
ELSE
BEGIN
    PRINT 'CreatedAt column already exists';
END

-- Update existing records to set default values
UPDATE Tasks SET Status = 'Pending' WHERE Status IS NULL;
UPDATE Tasks SET CreatedAt = CONVERT(NVARCHAR(100), GETDATE(), 126) WHERE CreatedAt IS NULL;

-- Add Priority column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tasks' AND COLUMN_NAME = 'Priority')
BEGIN
    ALTER TABLE Tasks ADD Priority nvarchar(50) NULL;
    PRINT 'Added Priority column';
END
ELSE
BEGIN
    PRINT 'Priority column already exists';
END

-- Add AssignedTo column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tasks' AND COLUMN_NAME = 'AssignedTo')
BEGIN
    ALTER TABLE Tasks ADD AssignedTo nvarchar(100) NULL;
    PRINT 'Added AssignedTo column';
END
ELSE
BEGIN
    PRINT 'AssignedTo column already exists';
END

-- Create Comments table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TaskComments')
BEGIN
    CREATE TABLE TaskComments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        TaskId INT NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        CreatedAt NVARCHAR(100) NOT NULL,
        Author NVARCHAR(100) NULL,
        FOREIGN KEY (TaskId) REFERENCES Tasks(Id) ON DELETE CASCADE
    );
    PRINT 'Created TaskComments table';
END
ELSE
BEGIN
    PRINT 'TaskComments table already exists';
END

-- Create TaskChecklistItems table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TaskChecklistItems')
BEGIN
    CREATE TABLE TaskChecklistItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        TaskId INT NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        IsCompleted BIT NOT NULL DEFAULT 0,
        FOREIGN KEY (TaskId) REFERENCES Tasks(Id) ON DELETE CASCADE
    );
    PRINT 'Created TaskChecklistItems table';
END
ELSE
BEGIN
    PRINT 'TaskChecklistItems table already exists';
END

-- Create TaskLabels table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TaskLabels')
BEGIN
    CREATE TABLE TaskLabels (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        TaskId INT NOT NULL,
        Name NVARCHAR(50) NOT NULL,
        Color NVARCHAR(50) NOT NULL,
        FOREIGN KEY (TaskId) REFERENCES Tasks(Id) ON DELETE CASCADE
    );
    PRINT 'Created TaskLabels table';
END
ELSE
BEGIN
    PRINT 'TaskLabels table already exists';
END

PRINT 'Database update completed successfully';
