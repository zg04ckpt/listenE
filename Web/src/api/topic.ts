import { ITopicItem } from "./../types/topic";

import axios, { endpoints } from "../utils/axios";

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
    const URL = `${endpoints.topic.root}/${params.id}`;
    const res = await axios.delete(URL);
    return res;
  }

  if (params.id) {
    const URL = `${endpoints.topic.root}/${params.id}`;
    const response = await axios.put(URL, params);
    return response;
  }

  const res = await axios.post(endpoints.topic.root, params);
  return res;
}

export async function getDetailsTopic(topicId: number) {
  const URL = `${endpoints.topic.root}/${topicId}`;
  const response = await axios.get(URL);
  return response;
}

export async function deleteTopic(topicId: number) {
  const URL = `${endpoints.topic.root}/${topicId}`;
  const response = await axios.delete(URL);
  return response;
}

export async function updateTopic(topicId: number, data: FormData) {
  const URL = `${endpoints.topic.root}/${topicId}`;
  const response = await axios.put(URL, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function createTopic(data: FormData) {
  const URL = `${endpoints.topic.root}`;
  const response = await axios.post(URL, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
}
