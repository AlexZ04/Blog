export function sendToast(text) {
    new Toast({
        title: "Предупреждение...",
        text: text,
        theme: 'danger',
        autohide: true,
        interval: 2500
    });
}

export function sendToastSaved(text) {
    new Toast({
        title: "Уведомление",
        text: text,
        theme: 'success',
        autohide: true,
        interval: 1500
    });
}
