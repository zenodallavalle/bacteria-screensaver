import { useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { v4 as uuidv4 } from 'uuid';

const getUID = () => {
  const localUID = localStorage.getItem('uid');
  if (localUID) return localUID;
  const newUID = uuidv4();
  localStorage.setItem('uid', newUID);
  return newUID;
};

export const collectStart = async (quizUID, nickname, job, token) => {
  const url = new URL('start_event/', process.env.REACT_APP_API_URL);
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: process.env.REACT_APP_AUTH_KEY,
      },
      body: JSON.stringify({
        quiz_uid: quizUID,
        device_uid: getUID(),
        recaptcha_token: token,
        nickname,
        job,
      }),
    });
  } catch (error) {
    console.error('Error in collectStart: ', error);
  }
};

export const useCollectStart = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const returnFn = useCallback(
    async (quizUID, nickname, job) => {
      if (!executeRecaptcha) return;
      try {
        const recaptchaToken = await executeRecaptcha('collectStart');
        collectStart(quizUID, nickname, job, recaptchaToken);
      } catch (error) {
        console.error('Error in useCollectStart: ', error);
      }
    },
    [executeRecaptcha]
  );
  return { collectStart: returnFn };
};

const collectAnswer = async (
  quizUID,
  nickname,
  job,
  qId,
  answerId,
  questionText,
  answerText,
  recaptchaToken
) => {
  const url = new URL('answer_event/', process.env.REACT_APP_API_URL);
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: process.env.REACT_APP_AUTH_KEY,
      },
      body: JSON.stringify({
        quiz_uid: quizUID,
        device_uid: getUID(),
        recaptcha_token: recaptchaToken,
        nickname,
        job,
        question_id: qId,
        answer_id: answerId,
        question_text: questionText,
        answer_text: answerText,
      }),
    });
  } catch (error) {
    console.error('Error in collectAnswer: ', error);
  }
};

export const useCollectAnswer = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const returnFn = useCallback(
    async (quizUID, nickname, job, qId, answerId, questionText, answerText) => {
      if (!executeRecaptcha) return;
      try {
        const recaptchaToken = await executeRecaptcha('collectAnswer');
        collectAnswer(
          quizUID,
          nickname,
          job,
          qId,
          answerId,
          questionText,
          answerText,
          recaptchaToken
        );
      } catch (error) {
        console.error('Error in useCollectAnswer: ', error);
      }
    },
    [executeRecaptcha]
  );
  return { collectAnswer: returnFn };
};

const collectResult = async (quizUID, nickname, job, marks, recaptchaToken) => {
  const url = new URL('result_event/', process.env.REACT_APP_API_URL);
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: process.env.REACT_APP_AUTH_KEY,
      },
      body: JSON.stringify({
        quiz_uid: quizUID,
        device_uid: getUID(),
        recaptcha_token: recaptchaToken,
        nickname,
        job,
        marks,
      }),
    });
  } catch (error) {
    console.error('Error in collectAnswer: ', error);
  }
};

export const useCollectResult = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const returnFn = useCallback(
    async (quizUID, nickname, job, marks) => {
      if (!executeRecaptcha) return;
      try {
        const recaptchaToken = await executeRecaptcha('collectResult');
        collectResult(quizUID, nickname, job, marks, recaptchaToken);
      } catch (error) {
        console.error('Error in useCollectResult: ', error);
      }
    },
    [executeRecaptcha]
  );
  return { collectResult: returnFn };
};
