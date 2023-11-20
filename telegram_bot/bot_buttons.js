const share_number = {
  keyboard: [
    [
      {
        text: "Поділитись номером телефону 🤳",
        request_contact: true,
      },
    ],
  ],
  resize_keyboard: true,
};
const user_keyboard = {
  keyboard: [
    [
      {
        text: "Завантаження в процесі",
      },
    ],
    [
      {
        text: "Оплачені завантаження",
      },
    ],
    [
      {
        text: "Некомплект документів",
      },
    ],
  ],
  resize_keyboard: true,
};

module.exports = {
  share_number,
  user_keyboard,
};
