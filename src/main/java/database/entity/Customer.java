package database.entity;

import java.io.Serializable;
import java.lang.String;
import java.util.Set;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Customer
 *
 */

@NamedQueries({
		@NamedQuery(name = "Customer.findByRealName", query = "select e from Customer e where e.surname = :surname and e.lastname=:lastname"),
		@NamedQuery(name = "Customer.findByEmail", query = "Select e from Customer e where e.email =:email"),
		@NamedQuery(name = "Customer.findById", query = "Select e from Customer e where e.userid = :id"),
		@NamedQuery(name = "Customer.findOrdersByUserid", query = "Select o from Orders as o where o.customer.userid = :id "),
		@NamedQuery(name = "Customer.validateEmailAndUsername", query = "Select e from Customer e where e.email =:email or e.username = :username"),
		@NamedQuery(name = "Customer.findPassordByEmailOrUsername", query = "Select e.password from Customer e where e.username = :credential or e.email=:credential") })
@Entity
public class Customer implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int userid;
	@Column(nullable=false)
	private String surname;
	@Column(nullable=false)
	private String lastname;
	@Column(unique=true,nullable=false)
	private String username;
	@Column(unique=true,nullable=false)
	private String email;
	private int mobile;
	@Column(nullable=false)
	private String password;
	private String joinedDate;
	private String address;
	private String dateOfBrith;
	private int telephone;
	@Column(nullable=false)
	private String secureQuestion;
	@Column(nullable=false)
	private String secureAnswer;
	@Column(nullable=true)
	@OneToMany(mappedBy="customer",fetch=FetchType.LAZY,cascade = CascadeType.REFRESH)
	private Set<Orders> orders;
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
	public String getLastname() {
		return this.lastname;
	}

	public void setLastname(String Lastname) {
		this.lastname = Lastname;
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

	public String getAddress() {
		return address;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setAddress(String address) {
		this.address = address;
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

	public String getUserName() {
		return username;
	}

	public void setUserName(String userName) {
		this.username = userName;
	}
   
}
