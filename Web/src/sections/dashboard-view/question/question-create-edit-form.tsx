import type React from "react";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  CircularProgress,
  alpha,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tooltip,
  Zoom,
  Chip,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  Save,
  ArrowBack,
  Home,
  Dashboard,
  CloudUpload,
  Delete as DeleteIcon,
  NavigateNext,
  NavigateBefore,
  Image as ImageIcon,
  AudioFile,
  CheckCircleOutline,
  Help,
  LocalOffer,
  Add,
  Remove,
  Groups,
  FormatListNumbered,
  QuestionMark,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../../../provider/NotificationProvider";
import {
  getDetailPartOneQuestion,
  getDetailPartTwoQuestion,
  getDetailsGroup,
  createPartOneQuestion,
  createPartTwoQuestion,
  createPart34Question,
  updatePartOneQuestion,
  updatePartTwoQuestion,
  updatePart34Question,
  checkGroupAnswer,
  checkAnswerQuestion,
} from "../../../api/question";
import { getAllTags } from "../../../api/tag";
import { getAllTopics } from "../../../api/topic";
import type {
  IQuestionPartOnePostItem,
  IQuestionPartTwoPostItem,
  IQuestionPartT3PostItem,
  ISubAnswerPart34PostItem,
} from "../../../types/question";
import type { IAnswerPostItem } from "../../../types/answer";
import type { ITagItem } from "../../../types/tag";
import type { ITopicItem } from "../../../types/topic";
import { SelectChangeEvent } from "@mui/material";

function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`question-tabpanel-${index}`}
      aria-labelledby={`question-tab-${index}`}
      {...other}
      style={{ padding: "16px 0" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function QuestionCreateEditForm() {
  const [questionTypes, setQuestionTypes] = useState<Record<string, string>>(
    {}
  );

  console.log(questionTypes);

  const initialAnswer: IAnswerPostItem = {
    content: "",
  };

  const initialPartOneData: IQuestionPartOnePostItem = {
    image: null,
    audio: null,
    correctAnswer: 1,
    transcript: "",
    explanation: "",
    tagId: 0,
    answers: Array(4)
      .fill(null)
      .map(() => ({ ...initialAnswer })),
  };

  const initialPartTwoData: IQuestionPartTwoPostItem = {
    audio: null,
    correctAnswer: 1,
    transcript: "",
    explanation: "",
    tagId: 0,
    answers: Array(4)
      .fill(null)
      .map(() => ({ ...initialAnswer })),
  };

  const initialSubAnswer: ISubAnswerPart34PostItem = {
    content: "",
  };

  const initialSubQuestion = {
    correctAnswer: 1,
    explanation: "",
    stringQuestion: "",
    answers: Array(4)
      .fill(null)
      .map(() => ({ ...initialSubAnswer })),
  };

  const initialPart34Data: IQuestionPartT3PostItem = {
    image: undefined,
    audio: undefined,
    transcript: "",
    tagId: 0,
    questions: [{ ...initialSubQuestion }],
  };

  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const { questionId, groupId } = useParams<{
    questionId?: string;
    groupId?: string;
  }>();
  const [searchParams] = useSearchParams();
  const questionTypeFromUrl = searchParams.get("type");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const isEditGroupMode = !!groupId;
  const isEditMode = !!questionId || !!groupId;

  const [questionType, setQuestionType] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<ITagItem[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  const [topics, setTopics] = useState<ITopicItem[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  console.log(topics);

  const [partOneData, setPartOneData] = useState<IQuestionPartOnePostItem>({
    ...initialPartOneData,
  });
  const [partTwoData, setPartTwoData] = useState<IQuestionPartTwoPostItem>({
    ...initialPartTwoData,
  });
  const [part34Data, setPart34Data] = useState<IQuestionPartT3PostItem>({
    ...initialPart34Data,
  });

  const [activeQuestionTab, setActiveQuestionTab] = useState(0);

  const [errors, setErrors] = useState({
    questionType: "",
    topicType: "",
    tagId: "",
    image: "",
    audio: "",
    correctAnswer: "",
    transcript: "",
    answers: ["", "", "", ""],
    questions: [
      {
        stringQuestion: "",
        correctAnswer: "",
        explanation: "",
        answers: ["", "", "", ""],
      },
    ],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [tabValue] = useState(0);

  console.log(tabValue);

  const filteredTags = useMemo(() => {
    if (!questionType) return [];
    return tags.filter((tag) => tag.type === questionType);
  }, [tags, questionType]);

  const isPart34 = useMemo(() => {
    return questionType === "Part3" || questionType === "Part4";
  }, [questionType]);

  useEffect(() => {
    const fetchTopics = async () => {
      setTopicsLoading(true);
      try {
        const response = await getAllTopics();
        if (response?.data?.data) {
          const topicsData = response.data.data;
          setTopics(topicsData);

          const types = [
            ...new Set(topicsData.map((topic: ITopicItem) => topic.type)),
          ].filter((type) => type !== "BasicPractice") as string[];

          const typeMapping: Record<string, string> = {};
          types.forEach((type) => {
            typeMapping[type] = type;
          });

          typeMapping["Part3"] = "Part 3 (Conversation)";
          typeMapping["Part4"] = "Part 4 (Short Talk)";

          setQuestionTypes(typeMapping);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        showError("Failed to load topics. Please try again.");
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, [showError]);

  useEffect(() => {
    const fetchTags = async () => {
      setTagsLoading(true);
      try {
        const response = await getAllTags();
        if (response?.items) {
          setTags(response.items);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        showError("Failed to load tags. Please try again.");
      } finally {
        setTagsLoading(false);
      }
    };

    fetchTags();
  }, [showError]);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        setLoading(true);
        try {
          if (isEditGroupMode && groupId) {
            if (questionTypeFromUrl) setQuestionType(questionTypeFromUrl);
            const response = await getDetailsGroup(Number.parseInt(groupId));
            const groupData = response?.data?.data;
            let explanationsMap: Record<number, { explanation: string }> = {};
            let transcriptFromCheck: string | undefined = undefined;
            let explanationFromCheck: string | undefined = undefined;
            try {
              const checkRes = await checkGroupAnswer(Number.parseInt(groupId));
              const checkData = checkRes?.data?.data;
              transcriptFromCheck = checkData?.transcript;
              explanationFromCheck = checkData?.explanation;
              if (Array.isArray(checkData?.questionKeys)) {
                checkData.questionKeys.forEach((item: any) => {
                  explanationsMap[item.questionId] = {
                    explanation: item.explanation,
                  };
                });
              }
            } catch (e) {}
            if (groupData) {
              const tagId = groupData.questions[0]?.tagId || 0;
              const transformedData: IQuestionPartT3PostItem = {
                image: undefined,
                audio: undefined,
                transcript: transcriptFromCheck || groupData.transcript || "",
                tagId,
                questions: groupData.questions.map((q: any) => ({
                  correctAnswer: q.correctAnswer || 1,
                  explanation: explanationsMap[q.id]?.explanation || "",
                  stringQuestion: q.stringQuestion || "",
                  answers: q.answers.map((a: any) => ({
                    content: a.content || "",
                  })),
                })),
              };
              setPart34Data(transformedData);
              setImagePreview(groupData.imageUrl || null);
              setAudioPreview(groupData.audioUrl || null);
              setErrors((prev) => ({
                ...prev,
                questions: transformedData.questions.map(() => ({
                  stringQuestion: "",
                  correctAnswer: "",
                  explanation: "",
                  answers: ["", "", "", ""],
                })),
              }));
              return;
            }
          } else if (questionId) {
            if (questionTypeFromUrl) {
              setQuestionType(questionTypeFromUrl);
            }

            if (
              questionTypeFromUrl === "Part3" ||
              questionTypeFromUrl === "Part4"
            ) {
              try {
                const response = await getDetailsGroup(
                  Number.parseInt(questionId)
                );
                const groupData = response?.data?.data;

                if (groupData) {
                  const transformedData: IQuestionPartT3PostItem = {
                    image: undefined,
                    audio: undefined,
                    transcript: groupData.transcript || "",
                    tagId: groupData.tagId || 0,
                    questions: groupData.questions.map((q: any) => ({
                      correctAnswer: q.correctAnswer || 1,
                      explanation: q.explanation || "",
                      stringQuestion: q.stringQuestion || "",
                      answers: q.answers.map((a: any) => ({
                        content: a.content || "",
                      })),
                    })),
                  };

                  setPart34Data(transformedData);
                  setImagePreview(groupData.imageUrl || null);
                  setAudioPreview(groupData.audioUrl || null);

                  setErrors((prev) => ({
                    ...prev,
                    questions: transformedData.questions.map(() => ({
                      stringQuestion: "",
                      correctAnswer: "",
                      explanation: "",
                      answers: ["", "", "", ""],
                    })),
                  }));

                  return;
                }
              } catch (error) {
                console.error("Error fetching Part 3/4 question:", error);
              }
            }

            if (questionTypeFromUrl === "Part1") {
              try {
                const response = await getDetailPartOneQuestion(
                  Number.parseInt(questionId)
                );
                const questionData = response?.data?.data;
                let transcriptFromCheck: string | undefined = undefined;
                let explanationFromCheck: string | undefined = undefined;
                try {
                  const checkRes = await checkAnswerQuestion(
                    Number.parseInt(questionId)
                  );
                  const checkData = checkRes?.data?.data;
                  transcriptFromCheck = checkData?.transcript;
                  explanationFromCheck = checkData?.explanation;
                } catch (e) {}
                setPartOneData({
                  image: null,
                  audio: null,
                  correctAnswer: questionData.correctAnswer || 1,
                  transcript:
                    transcriptFromCheck || questionData.transcript || "",
                  explanation:
                    explanationFromCheck || questionData.explanation || "",
                  tagId: questionData.tagId,
                  answers: questionData.answers.map((a: any) => ({
                    content: a.content,
                  })),
                });
                setImagePreview(questionData.imageUrl || null);
                setAudioPreview(questionData.audioUrl || null);
                return;
              } catch (error) {
                console.error("Error fetching Part 1 question:", error);
              }
            }

            if (questionTypeFromUrl === "Part2") {
              try {
                const response = await getDetailPartTwoQuestion(
                  Number.parseInt(questionId)
                );
                const questionData = response?.data?.data;
                let transcriptFromCheck: string | undefined = undefined;
                let explanationFromCheck: string | undefined = undefined;
                try {
                  const checkRes = await checkAnswerQuestion(
                    Number.parseInt(questionId)
                  );
                  const checkData = checkRes?.data?.data;
                  transcriptFromCheck = checkData?.transcript;
                  explanationFromCheck = checkData?.explanation;
                } catch (e) {}
                setPartTwoData({
                  audio: null,
                  correctAnswer: questionData.correctAnswer || 1,
                  transcript:
                    transcriptFromCheck || questionData.transcript || "",
                  explanation:
                    explanationFromCheck || questionData.explanation || "",
                  tagId: questionData.tagId,
                  answers: questionData.answers.map((a: any) => ({
                    content: a.content,
                  })),
                });
                setAudioPreview(questionData.audioUrl || null);
                return;
              } catch (error) {
                console.error("Error fetching Part 2 question:", error);
              }
            }

            showError("Failed to load question data. Please try again.");
            navigate("/dashboard/manage-questions");
          }
        } catch (error) {
          console.error("Error fetching question:", error);
          showError("Failed to load question data. Please try again.");
          navigate("/dashboard/manage-questions");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isEditMode, questionId, navigate, showError, questionTypeFromUrl]);

  const handleQuestionTypeChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const type = event.target.value;
      setQuestionType(type);

      if (type === "Part1") {
        setPartOneData((prev) => ({ ...prev, tagId: 0 }));
      } else if (type === "Part2") {
        setPartTwoData((prev) => ({ ...prev, tagId: 0 }));
      } else if (type === "Part3" || type === "Part4") {
        setPart34Data((prev) => ({ ...prev, tagId: 0 }));
      }

      setErrors((prev) => ({ ...prev, questionType: "" }));
      setActiveStep(1);
    },
    []
  );

  const handlePartOneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setPartOneData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handlePartTwoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setPartTwoData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handlePart34Change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setPart34Data((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleTagChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      const tagId = Number(event.target.value);

      if (questionType === "Part1") {
        setPartOneData((prev) => ({
          ...prev,
          tagId,
        }));
      } else if (questionType === "Part2") {
        setPartTwoData((prev) => ({
          ...prev,
          tagId,
        }));
      } else if (isPart34) {
        setPart34Data((prev) => ({
          ...prev,
          tagId,
        }));
      }

      setErrors((prev) => ({ ...prev, tagId: "" }));
    },
    [questionType, isPart34]
  );

  const handleCorrectAnswerChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);

      if (questionType === "Part1") {
        setPartOneData((prev) => ({
          ...prev,
          correctAnswer: value,
        }));
      } else if (questionType === "Part2") {
        setPartTwoData((prev) => ({
          ...prev,
          correctAnswer: value,
        }));
      }

      setErrors((prev) => ({ ...prev, correctAnswer: "" }));
    },
    [questionType]
  );

  const handleAnswerChange = useCallback(
    (index: number, content: string) => {
      if (questionType === "Part1") {
        setPartOneData((prev) => {
          const newAnswers = [...prev.answers];
          newAnswers[index] = { content };
          return {
            ...prev,
            answers: newAnswers,
          };
        });
      } else if (questionType === "Part2") {
        setPartTwoData((prev) => {
          const newAnswers = [...prev.answers];
          newAnswers[index] = { content };
          return {
            ...prev,
            answers: newAnswers,
          };
        });
      }

      setErrors((prev) => {
        const newAnswerErrors = [...prev.answers];
        newAnswerErrors[index] = "";
        return {
          ...prev,
          answers: newAnswerErrors,
        };
      });
    },
    [questionType]
  );

  const handleSubQuestionChange = useCallback(
    (
      index: number,
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setPart34Data((prev) => {
        const newQuestions = [...prev.questions];
        newQuestions[index] = {
          ...newQuestions[index],
          [name]: value,
        };
        return {
          ...prev,
          questions: newQuestions,
        };
      });

      if (
        errors.questions[index] &&
        errors.questions[index][name as keyof (typeof errors.questions)[0]]
      ) {
        setErrors((prev) => {
          const newQuestionErrors = [...prev.questions];
          newQuestionErrors[index] = {
            ...newQuestionErrors[index],
            [name]: "",
          };
          return {
            ...prev,
            questions: newQuestionErrors,
          };
        });
      }
    },
    [errors.questions]
  );

  const handleSubQuestionCorrectAnswerChange = useCallback(
    (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setPart34Data((prev) => {
        const newQuestions = [...prev.questions];
        newQuestions[index] = {
          ...newQuestions[index],
          correctAnswer: value,
        };
        return {
          ...prev,
          questions: newQuestions,
        };
      });

      setErrors((prev) => {
        const newQuestionErrors = [...prev.questions];
        newQuestionErrors[index] = {
          ...newQuestionErrors[index],
          correctAnswer: "",
        };
        return {
          ...prev,
          questions: newQuestionErrors,
        };
      });
    },
    []
  );

  const handleSubQuestionAnswerChange = useCallback(
    (questionIndex: number, answerIndex: number, content: string) => {
      setPart34Data((prev) => {
        const newQuestions = [...prev.questions];
        const newAnswers = [...newQuestions[questionIndex].answers];
        newAnswers[answerIndex] = { content };
        newQuestions[questionIndex] = {
          ...newQuestions[questionIndex],
          answers: newAnswers,
        };
        return {
          ...prev,
          questions: newQuestions,
        };
      });

      setErrors((prev) => {
        const newQuestionErrors = [...prev.questions];
        const newAnswerErrors = [...newQuestionErrors[questionIndex].answers];
        newAnswerErrors[answerIndex] = "";
        newQuestionErrors[questionIndex] = {
          ...newQuestionErrors[questionIndex],
          answers: newAnswerErrors,
        };
        return {
          ...prev,
          questions: newQuestionErrors,
        };
      });
    },
    []
  );

  const handleQuestionTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      setActiveQuestionTab(newValue);
    },
    []
  );

  const handleAddSubQuestion = useCallback(() => {
    setPart34Data((prev) => {
      const newQuestions = [...prev.questions, { ...initialSubQuestion }];
      return {
        ...prev,
        questions: newQuestions,
      };
    });

    setErrors((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          stringQuestion: "",
          correctAnswer: "",
          explanation: "",
          answers: ["", "", "", ""],
        },
      ],
    }));

    setTimeout(() => {
      setActiveQuestionTab(part34Data.questions.length);
    }, 100);
  }, [part34Data.questions.length]);

  const handleRemoveSubQuestion = useCallback(
    (index: number) => {
      if (part34Data.questions.length <= 1) {
        showError("You must have at least one question in the group");
        return;
      }

      setPart34Data((prev) => {
        const newQuestions = prev.questions.filter((_, i) => i !== index);
        return {
          ...prev,
          questions: newQuestions,
        };
      });

      setErrors((prev) => {
        const newQuestions = prev.questions.filter((_, i) => i !== index);
        return {
          ...prev,
          questions: newQuestions,
        };
      });

      if (activeQuestionTab >= index && activeQuestionTab > 0) {
        setActiveQuestionTab(activeQuestionTab - 1);
      }
    },
    [part34Data.questions.length, activeQuestionTab, showError]
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            image: "Image size should not exceed 5MB",
          }));
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);

          if (questionType === "Part1") {
            setPartOneData((prev) => ({
              ...prev,
              image: file,
            }));
          } else if (isPart34) {
            setPart34Data((prev) => ({
              ...prev,
              image: file,
            }));
          }

          setErrors((prev) => ({
            ...prev,
            image: "",
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    [questionType, isPart34]
  );

  const handleAudioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        if (file.size > 10 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            audio: "Audio size should not exceed 10MB",
          }));
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          setAudioPreview(event.target?.result as string);

          if (questionType === "Part1") {
            setPartOneData((prev) => ({
              ...prev,
              audio: file,
            }));
          } else if (questionType === "Part2") {
            setPartTwoData((prev) => ({
              ...prev,
              audio: file,
            }));
          } else if (isPart34) {
            setPart34Data((prev) => ({
              ...prev,
              audio: file,
            }));
          }

          setErrors((prev) => ({
            ...prev,
            audio: "",
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    [questionType, isPart34]
  );

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);

    if (questionType === "Part1") {
      setPartOneData((prev) => ({
        ...prev,
        image: null,
      }));
    } else if (isPart34) {
      setPart34Data((prev) => ({
        ...prev,
        image: undefined,
      }));
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [questionType, isPart34]);

  const handleRemoveAudio = useCallback(() => {
    setAudioPreview(null);

    if (questionType === "Part1") {
      setPartOneData((prev) => ({
        ...prev,
        audio: null,
      }));
    } else if (questionType === "Part2") {
      setPartTwoData((prev) => ({
        ...prev,
        audio: null,
      }));
    } else if (isPart34) {
      setPart34Data((prev) => ({
        ...prev,
        audio: undefined,
      }));
    }

    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  }, [questionType, isPart34]);

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    let errorMessages: string[] = [];
    const newErrors = {
      questionType: "",
      topicType: "",
      tagId: "",
      image: "",
      audio: "",
      correctAnswer: "",
      transcript: "",
      answers: ["", "", "", ""],
      questions: part34Data.questions.map(() => ({
        stringQuestion: "",
        correctAnswer: "",
        explanation: "",
        answers: ["", "", "", ""],
      })),
    };
    if (!questionType) {
      newErrors.questionType = "Please select a question type";
      errorMessages.push("Please select a question type");
      isValid = false;
    }
    if (questionType === "Part1") {
      if (!partOneData.tagId) {
        newErrors.tagId = "Please select a tag";
        errorMessages.push("Please select a tag");
        isValid = false;
      }
      if (!isEditMode && !partOneData.image && !imagePreview) {
        newErrors.image = "Please upload an image";
        errorMessages.push("Please upload an image");
        isValid = false;
      }
      if (!isEditMode && !partOneData.audio && !audioPreview) {
        newErrors.audio = "Please upload an audio file";
        errorMessages.push("Please upload an audio file");
        isValid = false;
      }
      if (!partOneData.transcript.trim()) {
        newErrors.transcript = "Transcript is required";
        errorMessages.push("Transcript is required");
        isValid = false;
      }
      partOneData.answers.forEach((answer, index) => {
        if (!answer.content.trim()) {
          newErrors.answers[index] = "Answer content is required";
          errorMessages.push(`Answer ${index + 1} content is required`);
          isValid = false;
        }
      });
    } else if (questionType === "Part2") {
      if (!partTwoData.tagId) {
        newErrors.tagId = "Please select a tag";
        errorMessages.push("Please select a tag");
        isValid = false;
      }
      if (!isEditMode && !partTwoData.audio && !audioPreview) {
        newErrors.audio = "Please upload an audio file";
        errorMessages.push("Please upload an audio file");
        isValid = false;
      }
      if (!partTwoData.transcript.trim()) {
        newErrors.transcript = "Transcript is required";
        errorMessages.push("Transcript is required");
        isValid = false;
      }
      partTwoData.answers.forEach((answer, index) => {
        if (!answer.content.trim()) {
          newErrors.answers[index] = "Answer content is required";
          errorMessages.push(`Answer ${index + 1} content is required`);
          isValid = false;
        }
      });
    } else if (isPart34) {
      if (!part34Data.tagId) {
        newErrors.tagId = "Please select a tag";
        errorMessages.push("Please select a tag");
        isValid = false;
      }
      if (!isEditMode && !part34Data.audio && !audioPreview) {
        newErrors.audio = "Please upload an audio file";
        errorMessages.push("Please upload an audio file");
        isValid = false;
      }
      if (!part34Data.transcript.trim()) {
        newErrors.transcript = "Transcript is required";
        errorMessages.push("Transcript is required");
        isValid = false;
      }
      part34Data.questions.forEach((question, qIndex) => {
        if (!question.stringQuestion.trim()) {
          newErrors.questions[qIndex].stringQuestion =
            "Question text is required";
          errorMessages.push(`Question ${qIndex + 1} text is required`);
          isValid = false;
        }
        question.answers.forEach((answer, aIndex) => {
          if (!answer.content.trim()) {
            newErrors.questions[qIndex].answers[aIndex] =
              "Answer content is required";
            errorMessages.push(
              `Question ${qIndex + 1} - Answer ${
                aIndex + 1
              } content is required`
            );
            isValid = false;
          }
        });
      });
    }
    setErrors(newErrors);
    if (!isValid && errorMessages.length > 0) {
      showError(errorMessages[0]);
    }
    return isValid;
  }, [
    questionType,
    isPart34,
    partOneData,
    partTwoData,
    part34Data,
    isEditMode,
    imagePreview,
    audioPreview,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (isEditGroupMode && groupId) {
        if (part34Data.image) formData.append("image", part34Data.image);
        if (part34Data.audio) formData.append("audio", part34Data.audio);
        formData.append("transcript", part34Data.transcript);
        formData.append("tagId", part34Data.tagId.toString());
        part34Data.questions.forEach((question, qIndex) => {
          formData.append(
            `questions[${qIndex}].stringQuestion`,
            question.stringQuestion
          );
          formData.append(
            `questions[${qIndex}].correctAnswer`,
            String(question.correctAnswer)
          );
          formData.append(
            `questions[${qIndex}].explanation`,
            question.explanation
          );
          question.answers.forEach((answer, aIndex) => {
            formData.append(
              `questions[${qIndex}].answers[${aIndex}].content`,
              answer.content
            );
          });
        });
        await updatePart34Question(Number.parseInt(groupId), formData);
        showSuccess("Question group updated successfully!");
        navigate("/dashboard/manage-questions");
        return;
      }
      if (questionType === "Part1") {
        if (partOneData.image) {
          formData.append("image", partOneData.image);
        }

        if (partOneData.audio) {
          formData.append("audio", partOneData.audio);
        }

        formData.append("correctAnswer", String(partOneData.correctAnswer));
        formData.append("transcript", partOneData.transcript);
        formData.append("explanation", partOneData.explanation);
        formData.append("tagId", partOneData.tagId.toString());

        partOneData.answers.forEach((answer, index) => {
          formData.append(`answers[${index}].content`, answer.content);
        });

        if (isEditMode && questionId) {
          await updatePartOneQuestion(Number.parseInt(questionId), formData);
          showSuccess("Question updated successfully!");
        } else {
          await createPartOneQuestion(formData);
          showSuccess("Question created successfully!");
        }
      } else if (questionType === "Part2") {
        if (partTwoData.audio) {
          formData.append("audio", partTwoData.audio);
        }

        formData.append("correctAnswer", String(partTwoData.correctAnswer));
        formData.append("transcript", partTwoData.transcript);
        formData.append("explanation", partTwoData.explanation);
        formData.append("tagId", partTwoData.tagId.toString());

        partTwoData.answers.forEach((answer, index) => {
          formData.append(`answers[${index}].content`, answer.content);
        });

        if (isEditMode && questionId) {
          await updatePartTwoQuestion(Number.parseInt(questionId), formData);
          showSuccess("Question updated successfully!");
        } else {
          await createPartTwoQuestion(formData);
          showSuccess("Question created successfully!");
        }
      } else if (isPart34) {
        if (part34Data.image) {
          formData.append("image", part34Data.image);
        }

        if (part34Data.audio) {
          formData.append("audio", part34Data.audio);
        }

        formData.append("transcript", part34Data.transcript);
        formData.append("tagId", part34Data.tagId.toString());

        part34Data.questions.forEach((question, qIndex) => {
          formData.append(
            `questions[${qIndex}].stringQuestion`,
            question.stringQuestion
          );
          formData.append(
            `questions[${qIndex}].correctAnswer`,
            String(question.correctAnswer)
          );
          formData.append(
            `questions[${qIndex}].explanation`,
            question.explanation
          );

          question.answers.forEach((answer, aIndex) => {
            formData.append(
              `questions[${qIndex}].answers[${aIndex}].content`,
              answer.content
            );
          });
        });

        if (isEditMode && questionId) {
          await updatePart34Question(Number.parseInt(questionId), formData);
          showSuccess("Question group updated successfully!");
        } else {
          await createPart34Question(formData);
          showSuccess("Question group created successfully!");
        }
      }

      navigate("/dashboard/manage-questions");
    } catch (error) {
      console.error("Error saving question:", error);
      showError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } question. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const getCurrentData = useCallback(() => {
    if (questionType === "Part1") {
      return partOneData;
    } else if (questionType === "Part2") {
      return partTwoData;
    } else if (isPart34) {
      return part34Data;
    }
    return partOneData;
  }, [questionType, isPart34, partOneData, partTwoData, part34Data]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const steps = [
    {
      label: "Select Question Type",
      description: "Choose the type of question you want to create",
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <FormControl fullWidth error={!!errors.questionType}>
            <InputLabel id="question-type-label">Question Type</InputLabel>
            {topicsLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Loading question types...
                </Typography>
              </Box>
            ) : (
              <Select
                labelId="question-type-label"
                id="question-type"
                value={questionType}
                label="Question Type"
                onChange={handleQuestionTypeChange}
                disabled={isEditMode}
              >
                <MenuItem value="Part1">Part 1</MenuItem>
                <MenuItem value="Part2">Part 2</MenuItem>
                <MenuItem value="Part3">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Groups sx={{ mr: 1, color: "#9C27B0" }} />
                    Part 3 (Conversation)
                  </Box>
                </MenuItem>
                <MenuItem value="Part4">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormatListNumbered sx={{ mr: 1, color: "#FF9800" }} />
                    Part 4 (Short Talk)
                  </Box>
                </MenuItem>
              </Select>
            )}
            {errors.questionType && (
              <FormHelperText>{errors.questionType}</FormHelperText>
            )}
          </FormControl>
        </Box>
      ),
    },
    {
      label: "Basic Information",
      description: "Add tag and media files",
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <FormControl fullWidth error={!!errors.tagId}>
            <InputLabel id="tag-label">Tag</InputLabel>
            {tagsLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Loading tags...</Typography>
              </Box>
            ) : (
              <Select
                labelId="tag-label"
                id="tag"
                value={getCurrentData().tagId || ""}
                label="Tag"
                onChange={handleTagChange}
                startAdornment={
                  <LocalOffer
                    fontSize="small"
                    sx={{ mr: 1, ml: -0.5, color: "action.active" }}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
                disabled={!questionType}
              >
                {filteredTags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            )}
            {errors.tagId && <FormHelperText>{errors.tagId}</FormHelperText>}
            {!questionType && (
              <FormHelperText>
                Please select a question type first
              </FormHelperText>
            )}
            {questionType && filteredTags.length === 0 && (
              <FormHelperText error>
                No tags available for this question type. Please create a tag
                with type "{questionType}" first.
              </FormHelperText>
            )}
          </FormControl>

          {getCurrentData().tagId > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                icon={<LocalOffer fontSize="small" />}
                label={
                  filteredTags.find((t) => t.id === getCurrentData().tagId)
                    ?.name || "Selected Tag"
                }
                color="primary"
                variant="outlined"
                sx={{
                  borderRadius: 1.5,
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: `0 0 0 2px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                }}
              />
            </Box>
          )}

          {(questionType === "Part1" || isPart34) && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {questionType === "Part1"
                  ? "Question Image"
                  : "Question Image (Optional)"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    border: `1px dashed ${
                      errors.image
                        ? theme.palette.error.main
                        : theme.palette.divider
                    }`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundImage: imagePreview
                      ? `url(${imagePreview})`
                      : "none",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    bgcolor: alpha(theme.palette.background.default, 0.8),
                  }}
                >
                  {!imagePreview && (
                    <ImageIcon color="disabled" fontSize="large" />
                  )}
                </Box>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                    ref={imageInputRef}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 1, mr: 1 }}
                    >
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                  </label>
                  {imagePreview && (
                    <IconButton
                      color="error"
                      onClick={handleRemoveImage}
                      size="small"
                      sx={{
                        mb: 1,
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.error.main, 0.2),
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  {errors.image && (
                    <Typography variant="caption" color="error">
                      {errors.image}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    Recommended size: 800x600 pixels. Max file size: 5MB.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Question Audio
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  width: 150,
                  height: 80,
                  borderRadius: 2,
                  border: `1px dashed ${
                    errors.audio
                      ? theme.palette.error.main
                      : theme.palette.divider
                  }`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                }}
              >
                {audioPreview ? (
                  <audio
                    controls
                    src={audioPreview}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <AudioFile color="disabled" fontSize="large" />
                )}
              </Box>
              <Box>
                <input
                  accept="audio/*"
                  style={{ display: "none" }}
                  id="audio-upload"
                  type="file"
                  onChange={handleAudioChange}
                  ref={audioInputRef}
                />
                <label htmlFor="audio-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{ mb: 1, mr: 1 }}
                  >
                    {audioPreview ? "Change Audio" : "Upload Audio"}
                  </Button>
                </label>
                {audioPreview && (
                  <IconButton
                    color="error"
                    onClick={handleRemoveAudio}
                    size="small"
                    sx={{
                      mb: 1,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
                {errors.audio && (
                  <Typography variant="caption" color="error">
                    {errors.audio}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  Supported formats: MP3, WAV. Max file size: 10MB.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      label: "Question Content",
      description: "Add transcript and explanation",
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            name="transcript"
            label="Transcript"
            value={getCurrentData().transcript}
            onChange={
              questionType === "Part1"
                ? handlePartOneChange
                : questionType === "Part2"
                ? handlePartTwoChange
                : handlePart34Change
            }
            fullWidth
            multiline
            rows={4}
            error={!!errors.transcript}
            helperText={
              errors.transcript ||
              "Enter the transcript of the audio conversation or talk"
            }
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />

          {!isPart34 && (
            <TextField
              name="explanation"
              label="Explanation (Optional)"
              value={
                questionType === "Part1"
                  ? partOneData.explanation
                  : questionType === "Part2"
                  ? partTwoData.explanation
                  : ""
              }
              onChange={
                questionType === "Part1"
                  ? handlePartOneChange
                  : handlePartTwoChange
              }
              fullWidth
              multiline
              rows={3}
              InputProps={{
                sx: {
                  borderRadius: 1.5,
                },
              }}
            />
          )}
        </Box>
      ),
    },
    {
      label: isPart34 ? "Questions" : "Answer Options",
      description: isPart34
        ? "Add questions and answers for this group"
        : "Add answer options and select the correct one",
      content: isPart34 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeQuestionTab}
              onChange={handleQuestionTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  minWidth: 0,
                  px: 2,
                  py: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                },
              }}
            >
              {part34Data.questions.map((_, index) => (
                <Tab
                  key={index}
                  label={
                    <Badge
                      color={
                        errors.questions[index]?.stringQuestion
                          ? "error"
                          : "default"
                      }
                      variant={
                        errors.questions[index]?.stringQuestion
                          ? "dot"
                          : "standard"
                      }
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <QuestionMark fontSize="small" sx={{ mr: 0.5 }} />
                        Question {index + 1}
                      </Box>
                    </Badge>
                  }
                  id={`question-tab-${index}`}
                  aria-controls={`question-tabpanel-${index}`}
                />
              ))}
              <Tab
                icon={<Add />}
                aria-label="add question"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddSubQuestion();
                }}
                sx={{
                  minWidth: "60px !important",
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                  },
                }}
              />
            </Tabs>
          </Box>

          {part34Data.questions.map((question, questionIndex) => (
            <TabPanel
              key={questionIndex}
              value={activeQuestionTab}
              index={questionIndex}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  position: "relative",
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                }}
              >
                <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveSubQuestion(questionIndex)}
                    disabled={part34Data.questions.length <= 1}
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                      },
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mb: 2, pr: 4 }}>
                  Question {questionIndex + 1}
                </Typography>

                <TextField
                  name="stringQuestion"
                  label="Question Text"
                  value={question.stringQuestion}
                  onChange={(e) => handleSubQuestionChange(questionIndex, e)}
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.questions[questionIndex]?.stringQuestion}
                  helperText={errors.questions[questionIndex]?.stringQuestion}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                    },
                  }}
                />

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                  Answer Options
                  <Tooltip
                    title="Add 4 answer options and select the correct one"
                    TransitionComponent={Zoom}
                    arrow
                  >
                    <Help
                      fontSize="small"
                      sx={{
                        ml: 1,
                        verticalAlign: "middle",
                        color: "text.secondary",
                      }}
                    />
                  </Tooltip>
                </Typography>

                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <RadioGroup
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleSubQuestionCorrectAnswerChange(questionIndex, e)
                    }
                  >
                    {question.answers.map((answer, answerIndex) => (
                      <Card
                        key={answerIndex}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          borderColor:
                            question.correctAnswer === answerIndex + 1
                              ? theme.palette.success.main
                              : theme.palette.divider,
                          boxShadow:
                            question.correctAnswer === answerIndex + 1
                              ? `0 0 0 2px ${alpha(
                                  theme.palette.success.main,
                                  0.2
                                )}`
                              : "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <FormControlLabel
                              value={answerIndex + 1}
                              control={
                                <Radio
                                  color="success"
                                  sx={{
                                    "&.Mui-checked": {
                                      color: theme.palette.success.main,
                                    },
                                  }}
                                />
                              }
                              label={`Option ${answerIndex + 1}`}
                              sx={{ minWidth: 120 }}
                            />
                            <TextField
                              fullWidth
                              value={answer.content}
                              onChange={(e) =>
                                handleSubQuestionAnswerChange(
                                  questionIndex,
                                  answerIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter answer option ${
                                answerIndex + 1
                              }`}
                              error={
                                !!errors.questions[questionIndex]?.answers[
                                  answerIndex
                                ]
                              }
                              helperText={
                                errors.questions[questionIndex]?.answers[
                                  answerIndex
                                ]
                              }
                              size="small"
                              InputProps={{
                                sx: {
                                  borderRadius: 1.5,
                                },
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </FormControl>

                <TextField
                  name="explanation"
                  label="Explanation (Optional)"
                  value={question.explanation}
                  onChange={(e) => handleSubQuestionChange(questionIndex, e)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Explain why the correct answer is right"
                  sx={{ mt: 2 }}
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Paper>
            </TabPanel>
          ))}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddSubQuestion}
              sx={{ borderRadius: 1.5 }}
            >
              Add Another Question
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Answer Options
            <Tooltip
              title="Add 4 answer options and select the correct one"
              TransitionComponent={Zoom}
              arrow
            >
              <Help
                fontSize="small"
                sx={{ ml: 1, verticalAlign: "middle", color: "text.secondary" }}
              />
            </Tooltip>
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup
              value={
                questionType === "Part1"
                  ? partOneData.correctAnswer
                  : questionType === "Part2"
                  ? partTwoData.correctAnswer
                  : 1
              }
              onChange={handleCorrectAnswerChange}
            >
              {(questionType === "Part1"
                ? partOneData.answers
                : partTwoData.answers
              ).map((answer, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    borderColor:
                      (questionType === "Part1"
                        ? partOneData.correctAnswer
                        : partTwoData.correctAnswer) ===
                      index + 1
                        ? theme.palette.success.main
                        : theme.palette.divider,
                    boxShadow:
                      (questionType === "Part1"
                        ? partOneData.correctAnswer
                        : partTwoData.correctAnswer) ===
                      index + 1
                        ? `0 0 0 2px ${alpha(theme.palette.success.main, 0.2)}`
                        : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                    >
                      <FormControlLabel
                        value={index + 1}
                        control={
                          <Radio
                            color="success"
                            sx={{
                              "&.Mui-checked": {
                                color: theme.palette.success.main,
                              },
                            }}
                          />
                        }
                        label={`Option ${index + 1}`}
                        sx={{ minWidth: 120 }}
                      />
                      <TextField
                        fullWidth
                        value={answer.content}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        placeholder={`Enter answer option ${index + 1}`}
                        error={!!errors.answers[index]}
                        helperText={errors.answers[index]}
                        size="small"
                        InputProps={{
                          sx: {
                            borderRadius: 1.5,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      ),
    },
    {
      label: "Review & Submit",
      description: "Review your question and submit",
      content: (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isPart34 ? "Question Group Summary" : "Question Summary"}
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Question Type
                </Typography>
                <Typography variant="body1">
                  {questionType === "Part1"
                    ? "Part 1"
                    : questionType === "Part2"
                    ? "Part 2"
                    : questionType === "Part3"
                    ? "Part 3 (Conversation)"
                    : questionType === "Part4"
                    ? "Part 4 (Short Talk)"
                    : "Not selected"}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tag
                </Typography>
                <Box sx={{ display: "flex", mt: 0.5 }}>
                  {getCurrentData().tagId > 0 ? (
                    <Chip
                      icon={<LocalOffer fontSize="small" />}
                      label={
                        filteredTags.find(
                          (t) => t.id === getCurrentData().tagId
                        )?.name || "Selected Tag"
                      }
                      color="primary"
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                  ) : (
                    <Typography variant="body1">Not selected</Typography>
                  )}
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Media
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                  {(questionType === "Part1" || isPart34) && imagePreview && (
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundImage: `url(${imagePreview})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  )}

                  {audioPreview && (
                    <Box sx={{ maxWidth: 200 }}>
                      <audio
                        controls
                        src={audioPreview}
                        style={{ width: "100%" }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Transcript
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {getCurrentData().transcript || "Not provided"}
                </Typography>
              </Box>

              {!isPart34 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Answer Options
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {(questionType === "Part1"
                        ? partOneData.answers
                        : partTwoData.answers
                      ).map((answer, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            bgcolor:
                              (questionType === "Part1"
                                ? partOneData.correctAnswer
                                : partTwoData.correctAnswer) ===
                              index + 1
                                ? alpha(theme.palette.success.light, 0.2)
                                : "transparent",
                          }}
                        >
                          {(questionType === "Part1"
                            ? partOneData.correctAnswer
                            : partTwoData.correctAnswer) ===
                            index + 1 && (
                            <CheckCircleOutline
                              color="success"
                              fontSize="small"
                              sx={{ mr: 1 }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                (questionType === "Part1"
                                  ? partOneData.correctAnswer
                                  : partTwoData.correctAnswer) ===
                                index + 1
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            {answer.content || "No answer provided"}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              {isPart34 && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Questions ({part34Data.questions.length})
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {part34Data.questions.map((subQuestion, index) => (
                        <Box
                          key={index}
                          sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 1,
                            bgcolor: alpha(
                              theme.palette.background.default,
                              0.5
                            ),
                            border: `1px solid ${alpha(
                              theme.palette.divider,
                              0.5
                            )}`,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Question {index + 1}: {subQuestion.stringQuestion}
                          </Typography>
                          <Box sx={{ pl: 2 }}>
                            {subQuestion.answers.map((answer, aIndex) => (
                              <Box
                                key={aIndex}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                {subQuestion.correctAnswer === aIndex + 1 && (
                                  <CheckCircleOutline
                                    color="success"
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                  />
                                )}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight:
                                      subQuestion.correctAnswer === aIndex + 1
                                        ? "bold"
                                        : "normal",
                                  }}
                                >
                                  {aIndex + 1}. {answer.content}
                                  {subQuestion.correctAnswer === aIndex + 1 &&
                                    " (Correct)"}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNext fontSize="small" />}
        >
          <Link
            underline="hover"
            color="inherit"
            href="/"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Home sx={{ mr: 0.5, width: 20, height: 20 }} />
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Dashboard sx={{ mr: 0.5, width: 20, height: 20 }} />
            Dashboard
          </Link>
          <Typography color="text.primary">
            {isEditMode ? "Edit Question" : "Create Question"}
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {isEditMode ? "Edit Question" : "Create Question"}
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/dashboard/manage-questions")}
          >
            Back to Questions
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <AnimatePresence>
              <motion.form
                key={activeStep}
                onSubmit={handleSubmit}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Stepper
                  activeStep={activeStep}
                  orientation="vertical"
                  sx={{ mb: 3 }}
                >
                  {steps.map((step) => (
                    <Step key={step.label}>
                      <StepLabel>{step.label}</StepLabel>
                      <StepContent>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {step.description}
                        </Typography>
                        {step.content}
                        <Box sx={{ mb: 2, mt: 3 }}>
                          <div>
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              sx={{ mr: 1 }}
                              startIcon={<NavigateBefore />}
                            >
                              Back
                            </Button>
                            {activeStep === steps.length - 1 ? (
                              <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={submitting}
                                startIcon={<Save />}
                              >
                                {submitting ? (
                                  <CircularProgress size={24} color="inherit" />
                                ) : (
                                  "Submit"
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                sx={{ mr: 1 }}
                                endIcon={<NavigateNext />}
                                disabled={!questionType && activeStep === 0}
                              >
                                Next
                              </Button>
                            )}
                          </div>
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </motion.form>
            </AnimatePresence>
          )}
        </Paper>
      </Container>
    </motion.div>
  );
}
