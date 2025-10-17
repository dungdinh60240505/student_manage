let page = 1
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

const btn_save_edit = document.getElementById('btn_save_edit')
const input_edit_name = document.getElementById('input_edit_name')
const input_edit_birthday = document.getElementById('input_edit_birthday')
const input_edit_age = document.getElementById('input_edit_age')
const input_edit_class = document.getElementById('input_edit_class')
const input_edit_avatar = document.getElementById('input_edit_avatar')
const image_avatar_edit = document.getElementById('image_avatar_edit')
// const tbody_table = document.getElementById('tbody_table')
btn_save_edit.addEventListener('click', async () => {
    try {
        const name = input_edit_name.value.trim()
        const birthday = input_edit_birthday.value.trim()
        const age = input_edit_age.value.trim()
        const class_name = input_edit_class.value.trim()
        const avatar = input_edit_avatar.files[0]
        const gender = document.querySelector('input[name="input_edit_gender"]:checked').value
        if(!name) throw new Error('Vui lòng nhập tên học sinh')
        if(!birthday) throw new Error('Vui lòng nhập ngày sinh')
        if(!age) throw new Error('Vui lòng nhập tuổi')
        if(!class_name) throw new Error('Vui lòng nhập lớp học')
        // if(!avatar) throw new Error('Vui lòng nhập avatar')
        
        const id = btn_save_edit.dataset.id
        const formData = new FormData()
        formData.append('name', name)
        formData.append('birthday', birthday)
        formData.append('age', age)
        formData.append('class_name', class_name)
        formData.append('avatar', avatar)
        formData.append('gender', gender)
        formData.append('id', id)

        const res = await fetch('/student-update', {
            method: 'PUT',
            body: formData
        })

        const data = await res.json()
        if(data.error) throw new Error(data.error)
        
        alert("Chỉnh sửa học sinh thành công")
        popupEdit.hide()
        getData()
    } catch (error) {
        console.error(error)
        alert(error.message)
    }
})
const input_search = document.getElementById('input_search')
input_search.addEventListener('input', async () => {
    page=1
    getData()
})
async function getData(){
    try {
        const search = input_search.value
        const url = `/student-list?search=${encodeURIComponent(search)}&page=${page}`;
        const data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data_json = await data.json()

        drawTable(data_json.data)
        const {limit, count, length} = data_json
        renderPagination(count, page, limit, length)
    } catch (error) {
        console.error(error)
    }
}

const popupEdit = new bootstrap.Modal(document.getElementById('popup_edit'));
function drawTable(data){
    tbody_table.innerHTML = ''
    data.forEach(item => {
        const tr = document.createElement('tr')
        const index = tbody_table.querySelectorAll('tr').length + 1
        tr.innerHTML = `
            <td>${index + (page - 1) * 10}</td>
            <td>
                <img class="image-avatar" src="${item.avatar}">
            </td>
            <td>${item.name}</td>
            <td class="text-center">${item.age}</td>
            <td>${format_date(item.birthday,"DD/MM/YYYY")}</td>
            <td>${item.gender}</td>
            <td>
               <i class="fa-solid fa-pen-to-square text-primary btn-edit" ></i>
               <i class="fa-solid fa-trash-can text-danger btn-remove"></i>
            </td>
        `
        const btn_edit = tr.querySelector('.btn-edit')
        const btn_remove = tr.querySelector('.btn-remove')
        btn_edit.addEventListener('click', () => {
            try {
                console.log(item)
                btn_save_edit.setAttribute('data-id', item._id)
                input_edit_name.value = item.name
                input_edit_birthday.value = format_date(item.birthday,"YYYY-MM-DD")
                input_edit_age.value = item.age
                input_edit_class.value = item.class_name
                image_avatar_edit.src = item.avatar
                document.querySelector('input[name="input_edit_gender"][value="'+item.gender+'"]').checked = true
                popupEdit.show()

            } catch (error) {
                console.error(error)
            }
        })

        btn_remove.addEventListener('click', async () => {
            try {
                Swal.fire({
                    title: "Bạn có muốn xóa dữ liệu này?",
                    icon: "warning",
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: true,
                    confirmButtonText: `
                        Xác nhận
                    `,
                    cancelButtonText: `
                        Đóng
                    `,
                    cancelButtonAriaLabel: "Thumbs down"
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                        const data = await fetch(`/student-remove/${item._id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })

                        const data_json = await data.json()
                        if(data_json.error) throw new Error(data_json.error)
                        getData()
                    }
                  });
            } catch (error) {
                
            }
        })
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




function renderPagination(total_page, currentPage, page_size, length) {
    const div_pagination = document.getElementById('div_pagination')
    if(currentPage == 1 && length < page_size) return ''
    let paginationHTML = `<ul class="pagination pagination-secondary pagin-border-secondary">`;

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" aria-label="Previous" data-page="${currentPage - 1}">
                    <span aria-hidden="true">«</span><span class="sr-only">Previous</span>
                </a>
            </li>`;
    } else {
        paginationHTML += `
            <li class="page-item disabled">
                <a class="page-link" href="javascript:void(0)" aria-label="Previous">
                    <span aria-hidden="true">«</span><span class="sr-only">Previous</span>
                </a>
            </li>`;
    }

    // Hiển thị các trang gần với currentPage
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total_page, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Nếu trang bắt đầu không phải là 1, thêm dấu "..."
    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" data-page="1">1</a>
            </li>`;
        if (startPage > 2) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>`;
        }
    }

    // Hiển thị các số trang
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `
                <li class="page-item active">
                    <a class="page-link" href="javascript:void(0)" data-page="${i}">${i}</a>
                </li>`;
        } else {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="javascript:void(0)" data-page="${i}">${i}</a>
                </li>`;
        }
    }

    // Nếu trang kết thúc không phải là trang cuối cùng, thêm dấu "..."
    if (endPage < total_page) {
        if (endPage < total_page - 1) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>`;
        }
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" data-page="${total_page}">${total_page}</a>
            </li>`;
    }

    // Next button
    if (currentPage < total_page) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" aria-label="Next" data-page="${currentPage + 1}">
                    <span aria-hidden="true">»</span><span class="sr-only">Next</span>
                </a>
            </li>`;
    } else {
        paginationHTML += `
            <li class="page-item disabled">
                <a class="page-link" href="javascript:void(0)" aria-label="Next">
                    <span aria-hidden="true">»</span><span class="sr-only">Next</span>
                </a>
            </li>`;
    }

    paginationHTML += `</ul>`;

   div_pagination.innerHTML = paginationHTML
    div_pagination.querySelectorAll('.pagination .page-link').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            page = parseInt(this.getAttribute('data-page'));
            getData();
        });
    });
    
    // Thêm sự kiện click cho các nút trang
    
}



document.addEventListener('DOMContentLoaded', () => {
    getData()
})

