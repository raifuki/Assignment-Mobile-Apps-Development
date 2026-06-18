export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: Question[];
}

export const QUIZ_TOPICS: Topic[] = [
  {
    id: "kotlin-basics",
    name: "Kotlin Basics (Cơ bản dữ liệu)",
    description: "Biến, kiểu dữ liệu, Null Safety, Control flows, Lambda và cơ bản của lập trình tuyến tính bằng Kotlin.",
    icon: "code",
    questions: [
      {
        id: 1,
        text: "Trong Kotlin, điểm khác biệt cơ bản giữa việc khai báo biến với 'val' và 'var' là gì?",
        options: [
          "var là hằng số không thể thay đổi giá trị, val thì ngược lại",
          "val khai báo biến chỉ đọc (read-only) không thể gán lại; var khai báo biến có thể thay đổi giá trị",
          "val dùng cho biến cục bộ, var dùng cho thuộc tính lớp (class fields)",
          "val tiêu tốn nhiều bộ nhớ RAM hơn var khi cấp phát chương trình"
        ],
        correctIndex: 1,
        explanation: "Từ khóa 'val' định nghĩa biến chỉ đọc (read-only), chỉ được gán giá trị một lần duy nhất. Còn 'var' định nghĩa biến có thể thay đổi (mutable), cho phép gán lại nhiều lần."
      },
      {
        id: 2,
        text: "Kotlin giải quyết vấn đề lỗi NullPointerException (NPP) kinh điển bằng cơ chế nào?",
        options: [
          "Bắt buộc toàn bộ biến đều phải gán giá trị khác rỗng ngay khi biên dịch",
          "Tự động đặt tất cả các thuộc tính chưa khởi tạo về chuỗi rỗng \"\"",
          "Phân biệt kiểu dữ liệu Nullable (thêm dấu ?) và Non-Null, kiểm tra an toàn ngay ở bước biên dịch",
          "Sử dụng khối try-catch tự động bọc xung quanh mọi dòng code truy cập đối tượng"
        ],
        correctIndex: 2,
        explanation: "Kotlin tích hợp hệ thống kiểm tra kiểu dữ liệu tĩnh nghiêm ngặt. Kiểu dữ liệu thông thường mặc định không cho phép null. Muốn biến nhận giá trị null, ta phải thêm dấu hỏi chấm (ví dụ: String?), giúp phát hiện lỗi Null an toàn ở thời điểm compiler."
      },
      {
        id: 3,
        text: "Toán tử Safe Call nào dưới đây dùng để gọi phương thức từ một đối tượng có khả năng bị null?",
        options: [
          "!!",
          "?:",
          "?",
          "?."
        ],
        correctIndex: 3,
        explanation: "Toán tử '?.' (Safe Call) cho phép truy cập phương thức/mã nguồn của đối tượng nullable. Nếu đối tượng null, biểu thức trả về null lập tức và bỏ qua lệnh gọi, tránh crash ứng dụng. Tránh nhầm với toán tử Elvis '?:' dùng thiết lập giá trị mặc định."
      },
      {
        id: 4,
        text: "Cú pháp tạo một lớp Dữ liệu (Data Class) lưu trữ trạng thái người dùng trong Kotlin là gì?",
        options: [
          "struct User(val name: String, val age: Int)",
          "data class User(val name: String, val age: Int)",
          "class User data (val name: String, val age: Int)",
          "record User(val name: String, val age: Int)"
        ],
        correctIndex: 1,
        explanation: "Từ khóa 'data class' tạo một lớp dữ liệu. Kotlin sẽ tự động sinh các hàm chuẩn như equals(), hashCode(), toString(), componentN() và copy() dựa trên các property trong constructor chính."
      },
      {
        id: 5,
        text: "Toán tử Elvis (?:) trong Kotlin được dùng trong trường hợp nào?",
        options: [
          "Kiểm tra xem hai biến có cùng trỏ tới một vùng nhớ hay không",
          "Đặt giá trị mặc định thay thế nếu biểu thức phía trước trả về kết quả rỗng (null)",
          "Chuyển đổi kiểu dữ liệu một cách cưỡng chế sang dạng Non-Null",
          "Gọi một hàm callback sau khi hoàn thành tác vụ chạy ngầm"
        ],
        correctIndex: 1,
        explanation: "Toán tử Elvis '?:' hoạt động tương tự: nếu biểu thức bên trái khác null thì lấy kết quả bên trái, ngược lại lấy giá trị mặc định thiết lập ở bên phải toán tử."
      },
      {
        id: 6,
        text: "Hàm phạm vi (Scope Function) nào trả về kết quả là lambda's result (dòng cuối cùng của khối code)?",
        options: [
          "also và apply",
          "run, let và with",
          "apply và let",
          "run và apply"
        ],
        correctIndex: 1,
        explanation: "`let`, `run` và `with` trả về dòng cuối cùng của khối lệnh được thực thi. Trong khi `apply` và `also` trả về chính đối tượng gọi nó ban đầu."
      },
      {
        id: 7,
        text: "Khi xử lý danh sách không bổ sung được phần tử khác sau khi khởi tạo, cấu trúc nào là hợp lý nhất?",
        options: [
          "ArrayList<T>",
          "mutableListOf()",
          "listOf()",
          "Array<T>"
        ],
        correctIndex: 2,
        explanation: "Hàm `listOf()` trả về một danh sách chỉ đọc (immutable List). Nếu muốn chỉnh sửa như add, remove, ta buộc phải dùng `mutableListOf()`."
      },
      {
        id: 8,
        text: "Cấu trúc thay thế tuyệt vời cho lệnh switch-case truyền thống trong Kotlin là cấu trúc nào?",
        options: [
          "select()",
          "match-case",
          "choose",
          "when"
        ],
        correctIndex: 3,
        explanation: "Cấu trúc `when` trong Kotlin thay thế cho `switch-case` của Java. Nó linh hoạt hơn, cho phép kiểm tra điều kiện, khoảng giá trị, kiểu dữ liệu và không cần từ khóa `break` ở mỗi nhánh."
      },
      {
        id: 9,
        text: "Làm thế nào để khởi tạo trễ (lazy initialization) một thuộc tính chỉ đọc (val) để tránh lãng phí RAM lúc khởi dựng?",
        options: [
          "Sử dụng var kết hợp thuộc tính 'lateinit'",
          "Sử dụng val kết hợp cấu trúc 'by lazy { ... }'",
          "Khai báo thuộc tính đó trong hàm custom getter",
          "Gán thuộc tính đó là null rồi cập nhật trong hàm onCreate"
        ],
        correctIndex: 1,
        explanation: "`by lazy` dùng cho thuộc tính `val` (chỉ đọc) để trì hoãn việc tính toán khởi tạo cho tới lần truy cập đầu tiên. Đối với `var`, ta dùng từ khóa `lateinit`."
      },
      {
        id: 10,
        text: "Ý nghĩa của toán tử ép kiểu thông minh (Smart Cast) trong Kotlin là gì?",
        options: [
          "Nó ép kiểu tự động mọi kiểu số nguyên Integer lên Float khi chia cho 2",
          "Tự động ép kiểu đối tượng về kiểu mong muốn sau khi đã kiểm tra điều kiện bằng từ khóa 'is'",
          "Ép kiểu an toàn không bao giờ sinh ra lỗi phần mềm bất kể kiểu dữ liệu là gì",
          "Tự chuyển đổi mã bytecode Java sang mã máy ảo của hệ điều hành Android"
        ],
        correctIndex: 1,
        explanation: "Phép ép kiểu thông minh (Smart Cast) tự động ép kiểu biến sang kiểu cụ thể sau khi đã thực hiện kiểm tra kiểu (ví dụ bằng `if (x is String)`), lập trình viên không phải viết ép kiểu bằng lệnh `as` dài dòng nữa."
      }
    ]
  },
  {
    id: "android-ui",
    name: "Android UI & Components",
    description: "Activity, ConstraintLayout, RecyclerView, Adapter, View Binding và các vòng đời Activity Lifecycle.",
    icon: "layout",
    questions: [
      {
        id: 1,
        text: "Hàm callback nào trong Lifecycle của Activity được gọi khi giao diện bắt đầu hiển thị trực quan và người dùng có thể tương tác được trực tiếp?",
        options: [
          "onCreate()",
          "onStart()",
          "onResume()",
          "onPause()"
        ],
        correctIndex: 2,
        explanation: "Phương thức `onResume()` được gọi ngay khi Activity bắt đầu đi vào trạng thái Foreground, khả dụng hoàn toàn để người dùng tương tác trực tiếp (gõ phím, click button...)."
      },
      {
        id: 2,
        text: "Thành phần RecyclerView giải quyết vấn đề hiệu năng gì so với ListView truyền thống?",
        options: [
          "Nó chỉ hiển thị được ảnh vector thay vì ảnh PNG hay WebP",
          "Nó tái sử dụng (recycle) các view item đã trượt ra ngoài màn hình để tránh việc liên tục 'find view' tạo mới gây tốn bộ nhớ",
          "Nó bắt buộc tất cả phần tử danh sách phải có chiều cao bằng nhau hoàn toàn",
          "Nó tự động tải dữ liệu bất đồng bộ từ API server thông qua Retrofit mà không cần viết code"
        ],
        correctIndex: 1,
        explanation: "RecyclerView sử dụng mô hình ViewHolder. Thay vì khởi tạo các View mới khi cuộn danh sách (rất tốn bộ nhớ), nó chỉ thay đổi dữ liệu của các View cũ đã đi ra khỏi màn hình để gán cho các item mới sắp hiện ra."
      },
      {
        id: 3,
        text: "Phương thức nào trong RecyclerView.Adapter chịu trách nhiệm tạo mới giao diện và gói nó vào ViewHolder?",
        options: [
          "onBindViewHolder()",
          "getItemCount()",
          "onCreateViewHolder()",
          "notifyDataSetChanged()"
        ],
        correctIndex: 2,
        explanation: "`onCreateViewHolder` được gọi khi RecyclerView cần một ViewHolder mới. Phương thức này sẽ inflate XML tệp tin giao diện thành View và khởi tạo lớp ViewHolder chứa các tham chiếu view."
      },
      {
        id: 4,
        text: "Để gửi dữ liệu (ví dụ: Tên người dùng hoặc Điểm số) từ MainActivity sang QuizActivity, lập trình viên sử dụng cơ chế nào?",
        options: [
          "Lưu dữ liệu vào bộ nhớ đệm Cache tạm thời của ứng dụng hiển thị",
          "Gửi dữ liệu thông qua cấu trúc Bundle 'putExtra()' được đính kèm trực tiếp vào đối tượng Intent",
          "Thiết lập một biến tĩnh toàn cục public static lồng ghép trong lớp ứng dụng",
          "Viết trực tiếp thông tin vào cơ sở dữ liệu SQLite cục bộ rồi đọc lại bên kia"
        ],
        correctIndex: 1,
        explanation: "Khi gọi Intent điều hướng, ta đính kèm dữ liệu vào Intent qua cặp khóa-giá trị bằng phương thức `intent.putExtra()`. Lớp Activity nhận sẽ bóc tách giá trị thông qua `intent.getSerializableExtra()` hoặc `intent.getIntExtra()`, v.v."
      },
      {
        id: 5,
        text: "Lợi ích nổi bật nhất của việc sử dụng 'ConstraintLayout' làm giao diện cha (Root View) trong XML là gì?",
        options: [
          "Giúp giao diện luôn luôn hiển thị nền màu đen tuyền",
          "Làm phẳng phân cấp View (flat view hierarchy), tránh lồng nhau quá nhiều lớp XML gây chậm tốc độ render hình ảnh",
          "Bắt buộc tất cả các thiết bị Android phải co về một độ phân giải duy nhất",
          "Tự động dịch văn bản hiển thị sang các ngôn ngữ quốc tế"
        ],
        correctIndex: 1,
        explanation: "ConstraintLayout cho phép tạo các bố cục phức tạp với thiết kế phẳng hoàn toàn. Việc hạn chế tối đa các ViewGroup lồng nhau (nesting) giúp tối ưu hóa luồng đo lường (Measure) và vẽ giao diện trên hệ thống."
      },
      {
        id: 6,
        text: "Khi một Activity bị che khuất một phần bởi một Dialog trong suốt hoặc nửa màn hình, Activity đó rơi vào trạng thái nào?",
        options: [
          "onPause()",
          "onStop()",
          "onDestroy()",
          "onRestart()"
        ],
        correctIndex: 0,
        explanation: "Nếu Activity mất tiêu điểm (focus) nhưng vẫn hiển thị một phần trên màn hình (bị che một góc bởi Dialog), hệ thống sẽ gọi phương thức `onPause()` của Activity đó."
      },
      {
        id: 7,
        text: "Phương thức nào dùng để kết nối và áp dữ liệu lên các widget giao diện (TextView, Button) trong RecyclerView.Adapter?",
        options: [
          "onCreateViewHolder()",
          "onBindViewHolder()",
          "getItemViewType()",
          "onAttachedToRecyclerView()"
        ],
        correctIndex: 1,
        explanation: "`onBindViewHolder()` nhận vào một ViewHolder và vị trí của Item trong danh sách. Tại đây, ta lấy dữ liệu từ tập hợp (List) dựa trên position và gán lên các View."
      },
      {
        id: 8,
        text: "Để ứng dụng Android ghi nhớ điểm cao nhất (High Score) của người chơi kể cả khi tắt hẳn ứng dụng đi, công cụ nhẹ và phù hợp nhất là gì?",
        options: [
          "Ghi trực tiếp vào file raw text .txt trên thẻ nhớ SD của điện thoại",
          "Lưu trữ dữ liệu có cấu trúc cặp key-value đơn giản bằng SharedPreferences",
          "Thiết lập Server API trung gian để lưu dữ liệu cá nhân",
          "Sử dụng Room Database với cơ sở dữ liệu SQLite đầy đủ"
        ],
        correctIndex: 1,
        explanation: "SharedPreferences là cơ chế đơn giản giúp lưu trữ các cặp key-value dữ liệu nguyên thủy (boolean, float, int, long, string) một cách bền vững trên thiết bị, lý tưởng với điểm cao (High Score)."
      },
      {
        id: 9,
        text: "Thư viện View Binding trong Jetpack giúp tránh lỗi gì thường gặp khi lập trình Android bằng cú pháp XML?",
        options: [
          "Lỗi rò rỉ bộ nhớ khi gọi các kết nối mạng chậm chạp",
          "Lỗi gọi sai kiểu View hoặc tìm sai ID gây ném ra lỗi NullPointerException (NPE)",
          "Tránh các lỗi dịch sai câu chữ trong file strings.xml",
          "Ngăn lỗi thiết bị hết pin khi ứng dụng chạy quá lâu"
        ],
        correctIndex: 1,
        explanation: "View Binding tự động sinh ra một class ánh xạ an toàn cho mỗi tệp layout XML. Nó cung cấp cơ chế an toàn kiểu (type safety) và an toàn rỗng (null safety), loại bỏ hàm `findViewById()` gây nguy cơ NPE/ClassCastException."
      },
      {
        id: 10,
        text: "Phương thức nào phục vụ việc đăng ký các dịch vụ ngầm hoặc khởi tạo layout, khai báo View Binding lúc mới tạo Activity?",
        options: [
          "onStart()",
          "onResume()",
          "onCreate()",
          "onPostCreate()"
        ],
        correctIndex: 2,
        explanation: "Phương thức `onCreate()` là điểm khởi đầu cho chu kỳ sống của Activity. Tại đây, chúng ta thực hiện toàn bộ logic khởi tạo một lần duy nhất: thiết lập View Binding, gán layout, kết nối ViewModel."
      }
    ]
  },
  {
    id: "kotlin-mvvm",
    name: "MVVM & Advanced Architecture",
    description: "Bộ ba Model - View - ViewModel, LiveData, StateFlow, Coroutines và tách biệt nghiệp vụ Clean Code.",
    icon: "layers",
    questions: [
      {
        id: 1,
        text: "Trong mô hình kiến trúc MVVM, thành phần 'ViewModel' đóng vai trò trung gian chịu trách nhiệm chính về việc gì?",
        options: [
          "Trực tiếp cập nhật các thuộc tính màu sắc, font chữ và kích thước của các TextView",
          "Nắm giữ trạng thái dữ liệu giao diện (UI State), xử lý logic nghiệp vụ và không chứa tham chiếu trực tiếp đến Context/View để tránh rò rỉ bộ nhớ",
          "Draw trực tiếp các nút bấm ảo đồ họa 3D lên màn hình thiết bị",
          "Quản lý vòng đời Activity và xử lý việc quay màn hình thiết bị"
        ],
        correctIndex: 1,
        explanation: "ViewModel giữ và quản lý dữ liệu cho UI một cách nhận biết vòng đời (lifecycle-aware). Nó tuyệt đối không được tham chiếu tới Activity, Fragment hay View để tránh ghim bộ nhớ gây lọt bộ nhớ (Memory Leak) khi xoay màn hình."
      },
      {
        id: 2,
        text: "Vì sao 'ViewModel' không bị hủy đi khi người dùng xoay ngang màn hình điện thoại (Configuration Change), trong khi Activity thì có?",
        options: [
          "Bởi vì ViewModel chạy trên một tiến trình hệ thống hệ điều hành hoàn toàn riêng biệt",
          "Do hệ thống Android cung cấp lớp bọc ViewModelStoreOwner giúp lưu giữ ViewModel vượt ngoài vòng đời thông thường của Activity",
          "Nó được ghi cứng vào tệp file cài đặt APK vĩnh viễn không thể dọn dẹp",
          "Do lập trình viên đã cấu hình thuộc tính android:configChanges=\"orientation\" trong Manifest"
        ],
        correctIndex: 1,
        explanation: "Khi Activity bị hủy và tái tạo do thay đổi cấu hình, ViewModelStoreOwner vẫn duy trì thể hiện (instance) của ViewModel. Khi Activity mới khởi tạo lại, nó sẽ kết nối lại với chính ViewModel cũ và lấy lại trạng thái an toàn."
      },
      {
        id: 3,
        text: "Lớp 'MutableLiveData' khác lớp 'LiveData' thường ở khả năng nào?",
        options: [
          "MutableLiveData chỉ dùng được với luồng Coroutine ngầm",
          "MutableLiveData cho phép chỉnh sửa, ghi đè giá trị mới lên dữ liệu thông qua setValue() / postValue(); còn LiveData thì chỉ cho phép đọc dữ liệu (read-only)",
          "MutableLiveData tự động hủy đăng ký khi Activity rơi vào trạng thái onStop",
          "MutableLiveData không lưu giữ giá trị cũ mà luôn trả về giá trị null"
        ],
        correctIndex: 1,
        explanation: "`MutableLiveData` kế thừa từ `LiveData` và công khai thêm hai phương thức `setValue()` (chạy trên UI Thread) và `postValue()` (chạy ngầm). Điều này giúp đóng gói nguyên lý Encapsulation, chỉ cho ViewModel sửa đổi dữ liệu."
      },
      {
        id: 4,
        text: "Cách đăng ký lắng nghe dữ liệu biến động từ LiveData trong lớp Activity để tự cập nhật lên giao diện là gì?",
        options: [
          "Sử dụng hàm observe() truyền vào LifecycleOwner và một Observer callback",
          "Đặt một vòng lặp vô tận while (true) liên tục lấy giá trị mới của LiveData",
          "Gọi hàm updateLiveDataListener() trong luồng runOnUiThread",
          "Ghi đè phương thức onLiveDataChanged() mặc định của hệ thống Activity"
        ],
        correctIndex: 0,
        explanation: "Chúng ta gọi `liveData.observe(lifecycleOwner) { data -> ... }`. Hàm observer sẽ tự động lắng nghe và đẩy dữ liệu về khi Activity ở trạng thái hoạt động (Started/Resumed) và tự hủy quan sát khi Activity bị Destroyed."
      },
      {
        id: 5,
        text: "Sự khác biệt quan trọng giữa 'postValue(T)' và 'setValue(T)' trong MutableLiveData là gì?",
        options: [
          "postValue dùng trên luồng chính (Main Thread), setValue dùng trên luồng phụ ngầm (Background Thread)",
          "postValue dùng để cập nhật giá trị an toàn từ bất kỳ luồng ngầm nào; setValue bắt buộc phải gọi từ luồng giao diện chính (UI/Main Thread)",
          "postValue nhanh hơn và tiết kiệm bộ nhớ điện thoại hơn setValue gấp 10 lần",
          "setValue gửi thông báo chậm hơn postValue 30 giây"
        ],
        correctIndex: 1,
        explanation: "`setValue()` đồng bộ hóa trực tiếp trên Main Thread. Nếu bạn đang xử lý tính toán ngầm (Worker, Coroutines) mà muốn gửi dữ liệu giao diện, bạn buộc phải dùng `postValue()` để điều hướng tác vụ lên Main Thread an toàn."
      },
      {
        id: 6,
        text: "Khái niệm 'Repository Pattern' trong kiến trúc Clean Code và Android Architecture Components đóng vai trò gì?",
        options: [
          "Nơi lưu toàn bộ file hình ảnh, CSS và âm thanh tài nguyên của hệ thống",
          "Thiết lập lớp trung gian làm điểm truy cập dữ liệu duy nhất (Single Source of Truth), điều hành việc lấy dữ liệu từ Local Database hay Remote API server",
          "Tự động đồng bộ hóa mã nguồn của app lên dịch vụ GitHub lưu giữ",
          "Bộ điều khiển giúp nén và tách tài nguyên APK lúc đóng gói sản phẩm"
        ],
        correctIndex: 1,
        explanation: "Repository đóng vai trò trung gian che giấu các chi tiết lấy dữ liệu nguồn. ViewModel không biết và không quan tâm dữ liệu đến từ Firestore, Room DB hay Retrofit; nó chỉ gọi qua Repository để nhận dữ liệu mong muốn."
      },
      {
        id: 7,
        text: "Khi sử dụng Kotlin Coroutines trong ViewModel để gọi API bất đồng bộ mà không block Main Thread, luồng scope tốt nhất được cấu hình mặc định là?",
        options: [
          "GlobalScope",
          "MainScope()",
          "viewmodelScope (tự giải phóng / hủy coroutines khi ViewModel bị hủy)",
          "CoroutineScope(Dispatchers.Default)"
        ],
        correctIndex: 2,
        explanation: "`viewModelScope` được tích hợp sẵn trong thư viện Lifecycle ViewModel. Các job chạy ngầm khởi tạo trong scope này sẽ tự động hủy hoàn toàn khi ViewModel gọi phương thức `onCleared()` (giúp tránh leak luồng)."
      },
      {
        id: 8,
        text: "Vì sao không nên viết logic xử lý dữ liệu (ví dụ: tính toán điểm, lọc danh sách) trực tiếp bên trong lớp Activity / Fragment?",
        options: [
          "Bởi vì Activity/Fragment chỉ là lớp biểu diễn giao diện (View), viết logic vào đó vi phạm nguyên lý Single Responsibility Principle (SRP) và gây khó khăn khi viết unit test",
          "Bởi vì hệ điều hành Android sẽ crash ứng dụng nếu tệp tin Activity nặng hơn 200 dòng code",
          "Viết logic ở Activity làm tăng 50% mức độ tiêu hao dữ liệu mạng Internet",
          "Lớp Activity không hỗ trợ gọi các cú pháp xử lý vòng lặp như for hay when"
        ],
        correctIndex: 0,
        explanation: "View (Activity/Fragment) chỉ nên chịu trách nhiệm duy nhất là hiển thị giao diện và thu nhận cử chỉ người dùng. Đưa logic nghiệp vụ phức tạp vào view dẫn đến code bị phình to (God Activity), cực kỳ khó bảo trì và không thể viết unit test độc lập."
      },
      {
        id: 9,
        text: "Trong MVVM, làm thế nào để ViewModel thông báo sự kiện sử dụng một lần (One-off events) như hiển thị Toast hoặc chuyển giao diện, để tránh lặp lại sự kiện khi xoay màn hình?",
        options: [
          "Đưa dữ liệu vào LiveData bình thường và gán lại là null sau khi đọc xong",
          "Sử dụng Event Wrapper hoặc thư viện SingleLiveEvent / Flow SharedFlow",
          "Lưu trực tiếp vào SharedPreferences mỗi lần thay đổi xoay hướng điện thoại",
          "Tạo Listener định dạng interface gán cứng trực tiếp từ Activity vào ViewModel"
        ],
        correctIndex: 1,
        explanation: "LiveData thông thường giữ giá trị cuối cùng và phát lại (replay) cho Observers mới khi tái tạo. Để quản lý các sự kiện một lần (Toast, Navigation), phương pháp tốt nhất là dùng một Event wrapper hoặc `SingleLiveEvent` / `SharedFlow` không lưu mút trạng thái vĩnh viễn."
      },
      {
        id: 10,
        text: "Để theo dõi trạng thái Timer đếm ngược trong ứng dụng Quiz một cách trực quan bằng StateFlow, chúng ta bắt đầu khởi tạo dòng dữ liệu như thế nào?",
        options: [
          "val timerFlow = Flow<Int>()",
          "val timerFlow = MutableStateFlow(30)",
          "val timerFlow = liveData { emit(30) }",
          "val timerFlow = flowOf(30)"
        ],
        correctIndex: 1,
        explanation: "`MutableStateFlow` là dòng dữ liệu có trạng thái (State-holder Flow), yêu cầu một giá trị mặc định lúc khởi tạo (ví dụ: 30 giây). Nó liên tục phát giá trị mới và chỉ phát ra giá trị khác biệt, rất phù hợp theo dõi trạng thái thời gian đếm ngược."
      }
    ]
  }
];
