import {Module} from "@nestjs/common";
import {ScheduleModule} from "@nestjs/schedule";
import {TaskService} from "../task/task.service";
import {BatchesController} from "./batches.controller";


@Module({
    imports: [
        ScheduleModule.forRoot(),
    ],
    providers: [TaskService],
    controllers: [ BatchesController],

})
export class BatchModule{}
