import { ITopicItem } from "./../types/topic";

import axios, { endpoints } from "../utils/axios";

// ----------------------------------------------------------------------

export async function getAllTopics() {
  const URL = `${endpoints.topic.root}`;
  const res = await axios.get(URL);
  return res;
}

export async function updateOrCreateTopic(
  params: ITopicItem,
  isDelete: boolean = false
) {
  if (isDelete) {
    // delete
    const URL = `${endpoints.topic.root}/${params.id}`;
    const res = await axios.delete(URL);
    return res;
  }

  if (params.id) {
    // update
    const URL = `${endpoints.topic.root}/${params.id}`;
    const response = await axios.put(URL, params);
    return response;
  }

  // add
  const res = await axios.post(endpoints.topic.root, params);
  return res;
}

export async function getAllTopicSessions(topicId: number) {
  const URL = `${endpoints.topic.listSession(topicId)}`;
  const response = await axios.get(URL);
  return response;
}

export async function getDetailsTopic(topicId: number) {
  const URL = `${endpoints.topic.root}/${topicId}`;
  const response = await axios.get(URL);
  return response;
}
