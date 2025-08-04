import { SideChat } from "@/components/SideChat"

const settings = {
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzMzMTg4LWZhY2QtNGFhZS1hNWVkLTc1ZDBhOTZhODVkOSJ9.0LKP3SKl_F0mhDy_Wr19szrqzbvI_YjUeCipxGdEgfA",
    apiUrl: "https://chat.hoclieu.vn",
    model: "gpt-4",
}


export default function Home() {
    return (
        <SideChat settings={settings}>
            <div>
                <h2>Bài học Địa lý lớp 9</h2>

                <section>
                    <h3>1. Địa hình Việt Nam</h3>
                    <p>
                        Địa hình Việt Nam rất đa dạng và phức tạp, chủ yếu là đồi núi (chiếm 3/4 diện tích),
                        thấp dần từ Tây Bắc xuống Đông Nam. Núi cao tập trung ở phía Bắc và Tây Bắc.
                    </p>
                </section>

                <section>
                    <h3>2. Khí hậu Việt Nam</h3>
                    <p>
                        Việt Nam nằm trong đới khí hậu nhiệt đới gió mùa, có hai mùa rõ rệt: mùa mưa và mùa khô.
                        Khí hậu phân hóa theo chiều Bắc – Nam và theo độ cao.
                    </p>
                </section>

                <section>
                    <h3>3. Sông ngòi và tài nguyên nước</h3>
                    <p>
                        Việt Nam có mạng lưới sông ngòi dày đặc, gồm hai hệ thống sông lớn:
                        sông Hồng ở miền Bắc và sông Cửu Long ở miền Nam. Nguồn nước dồi dào,
                        thuận lợi cho sản xuất và sinh hoạt, nhưng cũng gây lũ lụt nếu không kiểm soát tốt.
                    </p>
                </section>

                <section>
                    <h3>4. Dân số và phân bố dân cư</h3>
                    <p>
                        Việt Nam là nước đông dân, dân số hơn 100 triệu người (2024).
                        Dân cư phân bố không đều, tập trung đông ở đồng bằng và ven biển,
                        thưa thớt ở vùng núi và cao nguyên.
                    </p>
                </section>

                <section>
                    <h3>5. Các vùng kinh tế</h3>
                    <p>
                        Cả nước chia thành 7 vùng kinh tế: Trung du và miền núi Bắc Bộ,
                        Đồng bằng sông Hồng, Bắc Trung Bộ, Duyên hải Nam Trung Bộ, Tây Nguyên,
                        Đông Nam Bộ và Đồng bằng sông Cửu Long. Mỗi vùng có thế mạnh và đặc điểm riêng.
                    </p>
                </section>

                <section>
                    <h3>6. Đô thị hóa</h3>
                    <p>
                        Quá trình đô thị hóa diễn ra nhanh chóng, tập trung chủ yếu ở các thành phố lớn
                        như Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ. Tuy nhiên, chất lượng đô thị và dịch vụ chưa đồng đều.
                    </p>
                </section>

                <section>
                    <h3>7. Vấn đề môi trường</h3>
                    <p>
                        Việt Nam đang đối mặt với nhiều vấn đề môi trường: ô nhiễm không khí,
                        nguồn nước, rác thải nhựa, và biến đổi khí hậu. Cần tăng cường tuyên truyền
                        và hành động bảo vệ môi trường.
                    </p>
                </section>
            </div>
        </SideChat>
    );
}

