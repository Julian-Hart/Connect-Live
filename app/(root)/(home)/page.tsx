import React from "react";
import HomeHeader from "@/components/HomeHeader";
import MeetingTypeList from "@/components/MeetingTypeList";

const Home = () => {
  return (
    <section className="flex sixe-full flex-col gap-10 text-white">
      <HomeHeader />
      <MeetingTypeList />
    </section>
  );
};

export default Home;
