import { CommonAPI } from "./modules/common";
import { CourseAPI } from "./modules/course";
import { UserAPI } from "./modules/user";
import { StudentAPI } from "./modules/student";
import { PersonalityAPI } from "./modules/personality";
import { CharacterAPI } from "./modules/character";
import { LabelAPI } from "./modules/label";
import { TaskAPI } from "./modules/task";
import { TutorialAPI } from "./modules/tutorial";
export class API {
  user: UserAPI;
  course: CourseAPI;
  common: CommonAPI;
  student: StudentAPI;
  personality: PersonalityAPI;
  character: CharacterAPI;
  label: LabelAPI;
  task: TaskAPI;
  tutorial: TutorialAPI;
  constructor() {
    this.user = new UserAPI();
    this.course = new CourseAPI();
    this.common = new CommonAPI();
    this.student = new StudentAPI()
    this.personality = new PersonalityAPI()
    this.character = new CharacterAPI()
    this.label = new LabelAPI()
    this.task = new TaskAPI()
    this.tutorial = new TutorialAPI()
  }
}

export const apis = new API();
