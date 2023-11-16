import KlasService from "./modules/Klas/Klas.service";

// Checks if the teacher has access to the class
const CheckTeacherClasses = async (userId: number, classId: number) => {
  const klasService = new KlasService();
  let access = false;

  const klassen = await klasService.byTeacher(userId);
  klassen.forEach((klas) => {
    if (klas.id == classId) {
      access = true;
    }
  });

  return access;
};

// Converts the selected year to the year of the grade
// Example: fourth year -> second year of the second grade
const getGradeYear = (selectedYear: string) => {
  return Number(selectedYear) % 2 === 0 ? 2 : 1;
};

// Gives the year based on the selected year and the class the student is in now
const convertYear = (selectedYear: string, klas: string) => {
  // Covert the year into an array of each character
  const splitKlas = klas.split("");
  let convertedYear: number;
  let first = false;
  // Get the year based on the first number in the classname
  splitKlas.map((item) => {
    if (!isNaN(parseFloat(item))) {
      if (!first) {
        first = true;
        convertedYear = parseFloat(item);
      }
    }
  });

  // get the date of today
  const newDate = new Date();
  const dateYear = newDate.getFullYear();
  const dateMonth = String(newDate.getMonth() + 1).padStart(2, "0");
  const dateDay = String(newDate.getDate()).padStart(2, "0");
  const today = dateYear + "-" + dateMonth + "-" + dateDay;

  // returns the year based on the first semester
  if (today > `${dateYear}-09-01` && today <= `${dateYear}-12-31`) {
    return dateYear - (convertedYear - Number(selectedYear));
  }
  // returns the year based on the second semester
  if (today >= `${dateYear}-01-01` && today < `${dateYear}-07-01`) {
    return dateYear - (convertedYear - Number(selectedYear) + 1);
  }
};

// Gives the grade based on the selected year
const getGrade = (selectedYear: string) => {
  switch (String(selectedYear)) {
    case "1":
      return 1;
    case "2":
      return 1;
    case "3":
      return 2;
    case "4":
      return 2;
    case "5":
      return 3;
    case "6":
      return 3;
    case "7":
      return 3;
    default:
      break;
  }
};

// Gives the year based on the selected year and the class the teacher has selected
const convertTeacherYear = (selectedYear: string, klas: string) => {
  // get the first and second year of the selected schoolyear
  const firstYear = selectedYear.split("-")[0];
  const secondYear = selectedYear.split("-")[1];
  const splitKlas = klas.split("");
  let classYear: number;
  let first = false;
  // Get the year based on the first number in the classname
  splitKlas.map((item) => {
    if (!isNaN(parseFloat(item))) {
      if (!first) {
        first = true;
        classYear = parseFloat(item);
      }
    }
  });

  // get the date of today
  const newDate = new Date();
  const dateYear = newDate.getFullYear();
  const dateMonth = String(newDate.getMonth() + 1).padStart(2, "0");

  // returns the year based on the first semester
  if (dateMonth >= "09" && dateMonth <= "12") {
    return classYear - (dateYear - Number(firstYear));
  }

  // returns the year based on the second semester
  if (dateMonth >= "01" && dateMonth <= "6") {
    return classYear - (dateYear - Number(secondYear));
  }
};

export {
  CheckTeacherClasses,
  convertYear,
  getGrade,
  getGradeYear,
  convertTeacherYear,
};
