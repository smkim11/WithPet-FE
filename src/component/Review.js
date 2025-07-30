import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../context/UserContext';

export default function Review() {
    const title = useParams({});
    const { user } = useContext(UserContext);
    const [review, setReview]= useState({});
    const [reviewList, setReviewList] = useState([]);

    useEffect(()=>{
            fetch('http://localhost/selectReview?title='+title.title,{method: "get"})
            .then((res)=>(res.json()))
            .then((data)=>{setReviewList(data)})
    },[title.title]);

    // 사진을 업로드하기위해 json방식이 아닌 formData 형식으로 요청
    function insertReview(){
        const formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('title', title.title);
        formData.append('rating', review.rating);
        formData.append('comment', review.comment);
        if (review.file) {
            formData.append('uploadFile', review.file);
        }
        fetch('http://localhost/insertReview',{
            method:"post", body: formData,
        }).then((res)=>{
            if(res.ok){
                alert('등록성공');
                window.location.reload();
            }else{
                console.log(review.file);
                alert('등록실패');
            }

        })
    }
    return (
        <div>
            <h2>리뷰작성</h2>
            <table>
                <tbody>
                    <tr>
                        <th>가게</th>
                        <td><input type="text" value={title.title || ''} readOnly/></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>이름</th>                 {/*이름이 넘어오면 출력 아니면 빈칸 */}
                        <td><input type="text" value={user?.name || ''} readOnly/></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>평점</th>
                        <td>
                            {/*별 개수로 평점 저장 */}
                            {[1, 2, 3, 4, 5].map((val) => (
                                <React.Fragment key={val}>
                                <input type="radio" id={`star${val}`} name="rating" value={val}
                                    onChange={(e) => setReview({ ...review, rating: e.target.value })}
                                    checked={parseInt(review.rating) === val} style={{ display: "none" }}
                                />
                                <label htmlFor={`star${val}`}
                                    style={{fontSize: "20px",color: parseInt(review.rating) >= val ? "#FFD700" : "#ccc",
                                    cursor: "pointer"}}
                                >
                                    ★
                                </label>
                                </React.Fragment>
                            ))}
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>리뷰</th>
                        <td><textarea cols={50} rows={10} onChange={(e)=>(setReview({...review,comment:e.target.value}))}/></td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>사진</th>
                        <td><input type="file" id="image" name="image" accept="image/*" onChange={(e)=>(setReview({...review,file:e.target.files[0]}))}/></td>
                    </tr>
                </tbody>
            </table>
            <button onClick={insertReview}>작성</button>

            <h2>리뷰목록</h2>
                {
                    reviewList.map((list)=>(
                        
                        <div>
                            {list.name} 
                            <span style={{ color: "#FFD700", fontSize: "18px" }}>
                                {'★'.repeat(list.rating)}{'☆'.repeat(5 - list.rating)}
                            </span>
                           {
                            list.file == null ? 
                            <p>{list.comment}</p>
                            : <p>
                                <img 
                                    src={`http://localhost/file/${list.file}`} 
                                    alt="리뷰 이미지" 
                                    style={{ width: "200px" }}
                                /><br/>
                                {list.comment}
                            </p>
                           }
                        </div>
                    ))
                }
           
        </div>
    )
}
