const courses = [
  { code: 'WDD 130', subject: 'WDD', credits: 3, completed: true },
  { code: 'WDD 131', subject: 'WDD', credits: 3, completed: true },
  { code: 'WDD 231', subject: 'WDD', credits: 3, completed: false },
  { code: 'CSE 110', subject: 'CSE', credits: 2, completed: true },
  { code: 'CSE 111', subject: 'CSE', credits: 2, completed: false },
  { code: 'CSE 210', subject: 'CSE', credits: 2, completed: false }
];

const courseList = document.querySelector('#course-list');
const courseCount = document.querySelector('#course-count');
const buttons = document.querySelectorAll('.filter-button');

function displayCourses(filter = 'all') {
  const visibleCourses = filter === 'all' ? courses : courses.filter((course) => course.subject === filter);
  const credits = visibleCourses.reduce((total, course) => total + course.credits, 0);

  courseList.innerHTML = visibleCourses.map((course) => `
    <article class="course${course.completed ? ' completed' : ''}">
      ${course.completed ? '<span aria-label="Completed">✓ </span>' : ''}${course.code}
    </article>`).join('');
  courseCount.textContent = `The total credits for courses listed above is ${credits}.`;
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    displayCourses(button.dataset.filter);
  });
});

displayCourses();
