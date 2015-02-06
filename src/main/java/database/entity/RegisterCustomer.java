package database.entity;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class RegisterCustomer {

	private String surname;
	private String firstname;
	private String username;
	private String email;
	private String password;
	
	public RegisterCustomer() {
	}
	public RegisterCustomer(String surname, String firstname, String username,
			String email, String password) {
		super();
		this.surname = surname;
		this.firstname = firstname;
		this.username = username;
		this.email = email;
		this.password = password;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
}
