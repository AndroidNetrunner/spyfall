"use client";

import Entrance from "../components/Entrance";
import Lobby from "../components/Lobby";
import { useSelector } from "react-redux";
import { selectId } from "../redux/slices/userSlice";

export default function Home() {
  const id = useSelector(selectId);
  return id ? <Lobby /> : <Entrance />;
}
