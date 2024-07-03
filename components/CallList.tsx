//@ts-nocheck

"use client";
import React, { useEffect, useState } from "react";
import { useGetCalls } from "../hooks/useGetCalls";
import { useRouter } from "next/navigation";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import MeetingCard from "./MeetingCard";
import { Loader } from "lucide-react";
import { useToast } from "./ui/use-toast";

const CallList = ({ type }: { type: "upcoming" | "ended" | "recording" }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const router = useRouter();
  const [recordings, setRrecordings] = useState<CallRecording[]>([]);

  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "upcoming":
        return upcomingCalls;
      case "ended":
        return endedCalls;
      case "recording":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "upcoming":
        return "No Upcoming Calls";
      case "ended":
        return "No Ended Calls";
      case "recording":
        return "No Recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map(async (meeting) => {
            meeting.queryRecordings();
          })
        );
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRrecordings(recordings);
      } catch (error) {
        toast({ title: "Failed to fetch recordings, try again later." });
      }
    };

    if (type === "recording") fetchRecordings();
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="gri grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => {
          return (
            <MeetingCard
              key={(meeting as Call).id}
              icon={
                type === "ended"
                  ? "icons/previous.svg"
                  : type === "recording"
                  ? "icons/recordings.svg"
                  : "icons/upcoming.svg"
              }
              title={
                (meeting as Call).state?.custom?.description?.substring(
                  0,
                  20
                ) ||
                meeting?.filename?.substring(0, 20) ||
                "Personal Meeting"
              }
              date={
                meeting.state?.startsAt.toLocaleString() ||
                meeting.start_time.toLocaleString()
              }
              isPreviousMeeting={type === "ended"}
              buttonIcon1={type === "recording" ? "icons/play.svg" : undefined}
              handleClick={
                type === "recording"
                  ? router.push(meeting.url)
                  : () => {
                      router.push(`/meeting/${meeting.id}`);
                    }
              }
              link={
                type === "recording"
                  ? Meeting.url
                  : `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${meeting.id}`
              }
              buttonText={type === "recording" ? "Play" : "Start"}
            />
          );
        })
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
