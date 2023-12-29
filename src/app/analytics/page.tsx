import React from "react";
import TopTracks from "../components/TopTracks";
import UserPlaylists from "../components/UserPlaylists";
import Container from "../components/core/Container";

const WelcomeSection = () => {
  return (
    <section className="w-full py-4 md:py-8 lg:py-12 xl:py-18">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="">
            <h1 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Personalized Your Music Journey
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl py-4 dark:text-gray-400">
              Uncover your music journey with personalized analytics and data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

function Analytics() {
  return (
    <Container>
      <WelcomeSection />
      <TopTracks />
      <UserPlaylists />
    </Container>
  );
}

export default Analytics;
