export const typeToScreen = {
    announcement: 'Announcements',
    enrollment: 'Enrollments',
    fee: 'DarseNizamiFees',
    'exam-result': 'ExamResults',
    complaint: 'Complaint',
    'teacher-application': 'TeacherApplication',
    'class-test': 'MyTests',
    certificate: 'MyCertificates',
    'upcoming-courses': 'UpcomingCourses',
    general: 'Notification', // fallback — notifications list screen
    message: 'ChatList',
};

// remoteMessage.data se navigate karne ka helper
export const getScreenFromNotificationData = (data) => {
    const type = data?.type;
    return typeToScreen[type] || 'Notification';
};