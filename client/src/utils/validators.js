export const required = (value) =>
    value ? undefined : 'Обязательное поле'

export const email = value =>
    value && (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
        'Пожалуйста, введите корректный e-mail' : undefined)

export const password = value =>
    value && (!/(?=.*[0-9])(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])/g.test(value) ?
        'Пароль должен содержать символы в разных регистрах, цифры' : undefined)

export const passwordConfirmCreator = password => value =>
    value !== password ? 'Пароли не совпадают' : undefined
