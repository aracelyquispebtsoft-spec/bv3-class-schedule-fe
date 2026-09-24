import {
    Box,
    Card,
    CardContent,
    LinearProgress,
    Stack,
    Typography,
} from '@mui/material'

const getProgressPercentage = (
    assignedHours,
    requiredHours
) => {
    if (requiredHours <= 0) {
        return 100
    }

    return Math.min(
        (assignedHours / requiredHours) * 100,
        100
    )
}

function ProgressCourseCard({
    course,
    complete,
    subjects,
}) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={3}>
                    <Box>
                        <Typography
                            variant="h6"
                            component="h2"
                        >
                            {course.name}
                        </Typography>

                        {complete && (
                            <Typography
                                variant="body2"
                                color="success.main"
                                sx={{
                                    fontWeight: 600,
                                    mt: 0.5,
                                }}
                            >
                                Curso completo
                            </Typography>
                        )}
                    </Box>

                    {subjects.map(
                        ({
                            subject,
                            required_hours,
                            assigned_hours,
                            missing_hours,
                        }) => {
                            const percentage =
                                getProgressPercentage(
                                    assigned_hours,
                                    required_hours
                                )

                            const isComplete =
                                missing_hours === 0

                            return (
                                <Box
                                    key={subject.id}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                        }}
                                    >
                                        {subject.name}
                                    </Typography>

                                    {isComplete ? (
                                        <Typography
                                            variant="body2"
                                            color="success.main"
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            Completa
                                        </Typography>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {assigned_hours} h de{' '}
                                            {required_hours} · faltan{' '}
                                            {missing_hours} h
                                        </Typography>
                                    )}

                                    <LinearProgress
                                        variant="determinate"
                                        value={percentage}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                        }}
                                    />
                                </Box>
                            )
                        }
                    )}
                </Stack>
            </CardContent>
        </Card>
    )
}


export default ProgressCourseCard