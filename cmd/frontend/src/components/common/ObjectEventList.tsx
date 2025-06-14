import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { HoverInfoLabel, SectionBox, SimpleTable } from "@components/common";
import ShowHideLabel from "@components/common/ShowHideLabel";
import { KubeObject } from "@lib/k8s/cluster";
import Event, { KubeEvent } from "@lib/k8s/event";
import { localeDate, timeAgo } from "@lib/util";
import { HeadlampEventType, useEventCallback } from "redux/headlampEventSlice";

export interface ObjectEventListProps {
  object: KubeObject;
}

export default function ObjectEventList(props: ObjectEventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const dispatchEventList = useEventCallback(HeadlampEventType.OBJECT_EVENTS);

  useEffect(() => {
    if (events) {
      dispatchEventList(events, props.object);
    }
  }, [events]);

  async function fetchEvents() {
    const events = await Event.objectEvents(props.object);
    setEvents(events.map((e: KubeEvent) => new Event(e)));
  }
  const { t } = useTranslation(["translation", "glossary"]);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SectionBox title={t("glossary|Events")}>
      <SimpleTable
        columns={[
          {
            label: t("Type"),
            getter: (item) => {
              return item.type;
            },
          },
          {
            label: t("Reason"),
            getter: (item) => {
              return item.reason;
            },
          },
          {
            label: t("From"),
            getter: (item) => {
              return item.source.component;
            },
          },
          {
            label: t("Message"),
            getter: (item) => {
              return (
                item && (
                  <ShowHideLabel labelId={item?.metadata?.uid || ""}>
                    {item.message || ""}
                  </ShowHideLabel>
                )
              );
            },
          },
          {
            label: t("Age"),
            getter: (item) => {
              if (item.count > 1) {
                return `${timeAgo(item.lastOccurrence)} (${item.count} times over ${timeAgo(item.firstOccurrence)})`;
              }
              const eventDate = timeAgo(item.lastOccurrence, {
                format: "mini",
              });
              let label: string;
              if (item.count > 1) {
                label = t(
                  "{{ eventDate }} ({{ count }} times since {{ firstEventDate }})",
                  {
                    eventDate,
                    count: item.count,
                    firstEventDate: timeAgo(item.firstOccurrence),
                  },
                );
              } else {
                label = eventDate;
              }

              return (
                <HoverInfoLabel
                  label={label}
                  hoverInfo={localeDate(item.lastOccurrence)}
                  icon="mdi:calendar"
                />
              );
            },
            sort: (n1: KubeEvent, n2: KubeEvent) =>
              new Date(n2.lastTimestamp).getTime() -
              new Date(n1.lastTimestamp).getTime(),
          },
        ]}
        data={events}
      />
    </SectionBox>
  );
}
