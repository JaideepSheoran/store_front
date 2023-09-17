import React from 'react'
import '../log-in/Login.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const SignUp = () => {

	/**
	 *  For Email Verification via OTP
	 * 
	 * 
	 */
	const { signup } = useAuth();
	const [otpSent, setOTPSent] = useState(false);
	const [verified, setVerified] = useState(false);
	const [disabledSend, setDisabledSend] = useState(false);

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		phone : '',
		owner : '',
		otp : ''
	});
	
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const sendOTP = (e) => {
		e.preventDefault();

		setDisabledSend(true);

		fetch(`/send-otp/${formData.email}`).then((res) => {
			if (res.status == 500) {
				setDisabledSend(false);
				return res.text();
			}
			else if (res.status == 200) {
				setOTPSent(true);
				return res.text();
			}
		}).then((res) => {
			window.alert(res)
		}).catch(err => console.log(err));
	}

	const verifyOTP = (e) => {
		e.preventDefault();
		const OTP = formData.otp;
		console.log(OTP);
		axios.post(`/verify_otp/${formData.email}`, { OTP }, {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			}
		}).then((res) => {
			if (res.status == 401 || res.status == 500) {
				return res.data;
			} else if (res.status == 200) {
				setVerified(true);
				return res.data;
			}
		}).then(res => {
			window.alert(res);
		}).catch(err => {
			window.alert(err.response.data)
		});
	}


	const addUser = async (e) => {
		e.preventDefault();
		await signup(
			formData.email,
			formData.password,
			formData.phone,
			formData.owner
		);
	}

	return (
		<div className='form-container'>
			<div className="formdata">
				<p className='formhead'>Sign Up</p>
				<input onChange={handleChange} value={formData.email} placeholder='Email' required type="email" name='email' className='forminput' />
				<input onChange={handleChange} value={formData.otp} placeholder='OTP' required type="text" name='otp' className='forminput otp' />
				<input onChange={handleChange} value={formData.owner} placeholder='Owner Name' minLength="3" maxLength="25" required type="text" name='owner' className='forminput' />
				<input onChange={handleChange} value={formData.phone} placeholder='Phone' minLength="10" maxLength="10" required type="phone" name='phone' className='forminput' />
				<input onChange={handleChange} value={formData.password} placeholder='Password' minLength="7" maxLength="20" type="password" name="password" id="password" className='forminput' />
				<div className='formlogo'>
					{
						!verified && (
							otpSent
								?
								<button onClick={verifyOTP} type='submit' className='form-button'>Verify OTP</button>
								:
								<button disabled={disabledSend} onClick={sendOTP} type='submit' className='form-button'>Send OTP</button>
						)
					}

					{
						verified && <button onClick={addUser} type='submit' className='form-button'>Sign Up</button>
					}

					<Link to='/login/'>Already have an account ?</Link>
				</div>
			</div>
		</div>
	)
}

export default SignUp;