import { UserState } from "@/redux/slices/userSlice";
import { UserId } from "./UserId";

export default interface Players {
    [key: UserId]: UserState
}