package database.entity;

import java.io.Serializable;
import java.lang.String;
import java.util.Set;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;



/**
 * Entity implementation class for Entity: Customer
 *
 */

@NamedQueries({
		@NamedQuery(name = "Customer.findByRealName", query = "select e from Customer e where e.surname = :surname and e.firstname=:firstname"),
		@NamedQuery(name = "Customer.findByEmail", query = "Select e from Customer e where e.email =:email"),
		@NamedQuery(name = "Customer.findById", query = "Select e from Customer e where e.userid = :id"),
		@NamedQuery(name = "Customer.findOrdersByUserid", query = "Select o from Orders as o where o.customer.userid = :id "),
		@NamedQuery(name = "Customer.validateEmailAndUsername", query = "Select e from Customer e where e.email =:email or e.username = :username"),
		@NamedQuery(name = "Customer.findPassordByEmailOrUsername", query = "Select e.password from Customer e where e.username = :credential or e.email=:credential") ,
		@NamedQuery(name = "Customer.findCustomerByEmailOrUsername", query = "Select e from Customer e where e.username = :credential or e.email=:credential") })
@Entity
@XmlRootElement
public class Customer implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int userid;
	@Column(nullable=false)
	private String surname;
	@Column(nullable=false)
	private String firstname;
	@Column(unique=true,nullable=false)
	private String username;
	@Column(unique=true,nullable=false)
	private String email;
	@Column(nullable=true)
	private int mobile;
	@Lob	
	@Column(nullable=true)
	private byte[] profilePic;
	

	@Column(nullable=false)
	private String password;
	private String joinedDate;
	private String dateOfBrith;
	@Column(nullable=true)
	private int telephone;
	@Column(nullable=true)
	private String secureQuestion;
	@Column(nullable=true)
	private String secureAnswer;
	
	@Column(nullable=true)
	@OneToMany(mappedBy="customer",fetch=FetchType.EAGER,cascade = CascadeType.REFRESH)
	private Set<Orders> orders;
	@Column(nullable=true)
	@OneToMany(mappedBy="customer",fetch=FetchType.EAGER,cascade = CascadeType.REFRESH)
	private Set<Address> addresses;
	private static final long serialVersionUID = 1L;

	public Customer() {
		super();
	}   
	
	public int getUserid() {
		return this.userid;
	}

	public void setUserid(int userid) {
		this.userid = userid;
	}   
	public String getSurname() {
		return this.surname;
	}

	public void setSurname(String Surname) {
		this.surname = Surname;
	}   
	
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String Email) {
		this.email = Email;
	}   
	public int getMobile() {
		return this.mobile;
	}

	public void setMobile(int mobile) {
		this.mobile = mobile;
	}   
	
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}   
	public String getJoinedDate() {
		return this.joinedDate;
	}

	public void setJoinedDate(String joinedDate) {
		this.joinedDate = joinedDate;
	}

	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	
	public Set<Orders> getOrders() {
		return orders;
	}

	public void setOrders(Set<Orders> orders) {
		this.orders = orders;
	}

	public String getDateOfBrith() {
		return dateOfBrith;
	}

	public void setDateOfBrith(String dateOfBrith) {
		this.dateOfBrith = dateOfBrith;
	}

	public int getTelephone() {
		return telephone;
	}

	public byte[] getProfilePic() {
		return profilePic;
	}

	public void setProfilePic(byte[] profilePic) {
		this.profilePic = profilePic;
	}

	public void setTelephone(int telephone) {
		this.telephone = telephone;
	}

	public String getSecureQuestion() {
		return secureQuestion;
	}

	public void setSecureQuestion(String secureQuestion) {
		this.secureQuestion = secureQuestion;
	}

	public String getSecureAnswer() {
		return secureAnswer;
	}

	public void setSecureAnswer(String secureAnswer) {
		this.secureAnswer = secureAnswer;
	}

	

	public String getFirstname() {
		return firstname;
	}

	public Set<Address> getAddresses() {
		return addresses;
	}

	public void setAddresses(Set<Address> addresses) {
		this.addresses = addresses;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	@Override
	public String toString() {
		return "Customer [userid=" + userid + ", surname=" + surname
				+ ", lastname=" + firstname + ", username=" + username
				+ ", email=" + email + ", mobile=" + mobile + ", password="
				+ password + ", joinedDate=" + joinedDate  + ", dateOfBrith=" + dateOfBrith + ", telephone="
				+ telephone + ", secureQuestion=" + secureQuestion
				+ ", secureAnswer=" + secureAnswer + ", orders=" + orders + "]";
	}
   
}
