import { CommonAPI } from "./modules/common";
import { CourseAPI } from "./modules/course";
import { UserAPI } from "./modules/user";
import { StudentAPI } from "./modules/student";
import { PersonalityAPI } from "./modules/personality";
import { CharacterAPI } from "./modules/character";
export class API {
  user: UserAPI;
  course: CourseAPI;
  common: CommonAPI;
  student: StudentAPI;
  personality: PersonalityAPI;
  character: CharacterAPI;
  constructor() {
    this.user = new UserAPI();
    this.course = new CourseAPI();
    this.common = new CommonAPI();
    this.student = new StudentAPI()
    this.personality = new PersonalityAPI()
    this.character = new CharacterAPI()
  }
}

export const apis = new API();
