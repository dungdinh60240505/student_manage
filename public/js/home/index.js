const btn_save = document.getElementById('btn_save')
const input_add_name = document.getElementById('input_add_name')
const input_add_birthday = document.getElementById('input_add_birthday')
const input_add_age = document.getElementById('input_add_age')
const input_add_class = document.getElementById('input_add_class')
const input_add_avatar = document.getElementById('input_add_avatar')
const tbody_table = document.getElementById('tbody_table')
btn_save.addEventListener('click', async () => {
    try {
        const name = input_add_name.value.trim()
        const birthday = input_add_birthday.value.trim()
        const age = input_add_age.value.trim()
        const class_name = input_add_class.value.trim()
        const avatar = input_add_avatar.files[0]
        const gender = document.querySelector('input[name="input_add_gender"]:checked').value
        if(!name) throw new Error('Vui lòng nhập tên học sinh')
        if(!birthday) throw new Error('Vui lòng nhập ngày sinh')
        if(!age) throw new Error('Vui lòng nhập tuổi')
        if(!class_name) throw new Error('Vui lòng nhập lớp học')
        if(!avatar) throw new Error('Vui lòng nhập avatar')
            
        const formData = new FormData()
        formData.append('name', name)
        formData.append('birthday', birthday)
        formData.append('age', age)
        formData.append('class_name', class_name)
        formData.append('avatar', avatar)
        formData.append('gender', gender)

        const res = await fetch('/student-add', {
            method: 'POST',
            body: formData
        })

        const data = await res.json()
        if(data.error) throw new Error(data.error)
        
        alert("Thêm học sinh thành công")
        input_add_name.value = null
        input_add_birthday.value = null
        input_add_age.value = null
        input_add_class.value = null
        input_add_avatar.files[0] = null
        getData()
    } catch (error) {
        console.error(error)
        alert(error.message)
    }
})

const input_search = document.getElementById('input_search')
input_search.addEventListener('input', async () => {
    getData()
})
async function getData(){
    try {
        const search = input_search.value
        const url = `/student-list?search=${encodeURIComponent(search)}`;
        const data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data_json = await data.json()
        drawTable(data_json)
    } catch (error) {
        console.error(error)
    }
}

function drawTable(data){
    tbody_table.innerHTML = ''
    data.forEach(item => {
        const tr = document.createElement('tr')
        const index = tbody_table.querySelectorAll('tr').length + 1
        tr.innerHTML = `
            <td>${index}</td>
            <td>
                <img class="image-avatar" src="${item.avatar}">
            </td>
            <td>${item.name}</td>
            <td class="text-center">${item.age}</td>
            <td>${format_date(item.birthday,"DD/MM/YYYY")}</td>
            <td>${item.gender}</td>
            <td>
               <i class="fa-solid fa-pen-to-square text-primary"></i>
               <i class="fa-solid fa-trash-can text-danger"></i>
            </td>
        `
        tbody_table.appendChild(tr)
    });
}

function addZero(val, length = 2) {
	return String(val).padStart(length, '0')
}


function format_date(str_date, str_format = 'YYYY-MM-dd') {
	const date = new Date(str_date)
	if (!str_date || date == 'Invalid Date') return str_date

	const year = date.getFullYear()
	const month = addZero(date.getMonth() + 1)
	const day = addZero(date.getDate())

	const hour = addZero(date.getHours())
	const minutes = addZero(date.getMinutes())
	const seconds = addZero(date.getSeconds())

	str_format = str_format.replace('YYYY', year).replace('yyyy', year).replace('MM', month).replace('dd', day).replace('DD', day).replace('HH', hour).replace('hh', hour).replace('mm', minutes).replace('ss', seconds).replace('YY', year.toString().substring(2, 4)).replace('yy', year.toString().substring(2, 4))
	return str_format
}

document.addEventListener('DOMContentLoaded', () => {
    getData()
})
